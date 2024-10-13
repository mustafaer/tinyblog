import { Knex } from "knex";
import { IoCService } from "axe-api";
import { NotificationTypes } from "../../enums";
import PostService from "./PostService";
import { subHours } from "date-fns";

const getTargetUserIds = async (postId: number) => {
  const post = await PostService.getPost(postId);
  const mentions = await PostService.getMentions(postId);
  return [post.user_id, ...mentions.map((item) => item.user_id)];
};

const createNotification = async (
  type: NotificationTypes,
  targetUserId: number,
  postId?: number,
  replyId?: number
) => {
  const db = await IoCService.use<Knex>("Database");
  return await db.table("notifications").insert({
    user_id: targetUserId,
    type,
    post_id: postId,
    reply_id: replyId,
    count: 0,
    is_read: false,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

const createNotificationTrigger = async (
  notificationId: number,
  triggerUserId: number
) => {
  const db = await IoCService.use<Knex>("Database");
  await db.table("notifications_triggers").insert({
    notification_id: notificationId,
    trigger_user_id: triggerUserId,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await db
    .table("notifications")
    .where("id", notificationId)
    .increment({ count: 1 });
};

const create = async (
  type: NotificationTypes,
  notification: any,
  targetUserId: number,
  triggerUserId: number,
  postId?: number,
  replyId?: number
) => {
  let notificationId = notification?.id;
  if (!notification) {
    const [id] = await createNotification(type, targetUserId, postId, replyId);
    notificationId = id;
  }

  return await createNotificationTrigger(notificationId, triggerUserId);
};

const getPreviousNotificationByPost = async (
  type: NotificationTypes,
  targetUserId: number,
  postId: number
) => {
  const db = await IoCService.use<Knex>("Database");
  const sixHoursBefore = subHours(new Date(), 6);
  return await db
    .table("notifications")
    .where("user_id", targetUserId)
    .where("post_id", postId)
    .where("type", type)
    .where("created_at", ">", sixHoursBefore)
    .first();
};

const remove = async (
  type: NotificationTypes,
  triggerUserId: number,
  postId?: number
) => {
  const db = await IoCService.use<Knex>("Database");

  // Let's get the notification IDs
  const query = db
    .table("notifications_triggers")
    .select("notifications.id")
    .leftJoin(
      "notifications",
      "notifications.id",
      "notifications_triggers.notification_id"
    )
    .where("notifications.type", type)
    .where("notifications_triggers.trigger_user_id", triggerUserId);

  if (postId) {
    query.where("notifications.post_id", postId);
  } else {
    query.whereNull("notifications.post_id");
  }

  const notifications = await query;
  const notificationIds = notifications.map((item) => item.id);

  // Let's delete the user's triggers
  await db
    .table("notifications_triggers")
    .whereIn("notification_id", notificationIds)
    .where("trigger_user_id", triggerUserId)
    .delete();

  // Let's decrease the count of the notification
  await db
    .table("notifications")
    .whereIn("id", notificationIds)
    .decrement({ count: 1 });
};

const like = async (triggerUserId: number, postId: number) => {
  const targetUserIds = await getTargetUserIds(postId);

  for (const targetUserId of targetUserIds) {
    const notification = await getPreviousNotificationByPost(
      NotificationTypes.Like,
      targetUserId,
      postId
    );

    create(
      NotificationTypes.Like,
      notification,
      targetUserId,
      triggerUserId,
      postId
    );
  }
};

const reshare = async (triggerUserId: number, postId: number) => {
  const targetUserIds = await getTargetUserIds(postId);

  for (const targetUserId of targetUserIds) {
    const notification = await getPreviousNotificationByPost(
      NotificationTypes.Reshare,
      targetUserId,
      postId
    );

    create(
      NotificationTypes.Reshare,
      notification,
      targetUserId,
      triggerUserId,
      postId
    );
  }
};

const reply = async (
  triggerUserId: number,
  postId: number,
  replyId?: number
) => {
  const targetUserIds = await getTargetUserIds(postId);

  for (const targetUserId of targetUserIds) {
    const notification = await getPreviousNotificationByPost(
      NotificationTypes.Reply,
      targetUserId,
      postId
    );

    create(
      NotificationTypes.Reply,
      notification,
      targetUserId,
      triggerUserId,
      postId,
      replyId
    );
  }
};

export default {
  remove,
  like,
  reshare,
  reply,
};
