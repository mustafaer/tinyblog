import { INotificationApi } from "@/types/ApiTypes";
import NotificationNames from "./NotificationNames";
import FormatPostToJSX from "../posts/FormatPostToJSX";
import { extendPost } from "@/helpers/posts";

interface Props {
  notification: INotificationApi;
}

const LikeNotification = ({ notification }: Props) => {
  const post = extendPost(notification.post);

  return (
    <div>
      <div>
        <NotificationNames notification={notification} /> likes your post.
      </div>
      <div className="opacity-50 pt-3">
        <FormatPostToJSX data={post} />
      </div>
    </div>
  );
};

export default LikeNotification;
