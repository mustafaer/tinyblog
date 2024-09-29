import { create } from "zustand";
import { IPostApi } from "../types/ApiTypes";
import {
  getMaxId,
  getMinId,
  resolvePosts,
  toExtendedPost,
} from "../helpers/posts";

export interface ExtendedPost extends IPostApi {
  isViewed: boolean;
  parent?: ExtendedPost;
}

export interface IState {
  feeds: ExtendedPost[];
  minId: number;
  maxId: number;
}

export interface IPostStore {
  state: IState;
  setFeeds: (feeds: IPostApi[]) => void;
  pushFeed: (feed: IPostApi) => void;
  setViewed: (id: number, isAlreadyViewed: boolean) => void;
  like: (id: number) => void;
  unlike: (id: number) => void;
}

export const createStore = (name: string) =>
  create<IPostStore>()((set) => ({
    state: {
      feeds: [],
      minId: 0,
      maxId: 0,
    },

    setFeeds: (feeds: IPostApi[]) => {
      console.log("setFeeds", name);
      const { items, minId, maxId } = resolvePosts(feeds);

      set(() => ({
        state: {
          feeds: items,
          minId,
          maxId,
        },
      }));
    },

    pushFeed(feed: IPostApi) {
      const feeds = [...toExtendedPost([feed]), ...this.state.feeds];
      const maxId = getMaxId(feeds);
      const minId = getMinId(feeds);

      set(() => ({
        state: {
          feeds,
          minId,
          maxId,
        },
      }));
    },

    setViewed(id: number, isAlreadyViewed: boolean) {
      const newState = { ...this.state };
      const found = newState.feeds.find((item) => item.id === id);
      if (found) {
        found.isViewed = true;

        if (isAlreadyViewed !== true) {
          found.stats_views++;
        }
      }

      set(() => ({ state: newState }));
    },

    like(id: number) {
      const newState = { ...this.state };
      const found = newState.feeds.find((item) => item.id === id);
      if (found) {
        found.is_liked_by_you = true;
        found.stats_likes++;
      }

      set(() => ({ state: newState }));
    },

    unlike(id: number) {
      const newState = { ...this.state };
      const found = newState.feeds.find((item) => item.id === id);
      if (found) {
        found.is_liked_by_you = false;
        found.stats_likes--;
      }

      set(() => ({ state: newState }));
    },
  }));
