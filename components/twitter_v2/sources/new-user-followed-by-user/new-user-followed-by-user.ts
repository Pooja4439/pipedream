import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import { userFieldProps } from "../../common/propGroups";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { ListUserFollowingParams } from "../../common/types/requestParams";
import { User } from "../../common/types/responseSchemas";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following";
const MAX_RESULTS_PER_PAGE = 1000;

export default defineSource({
  ...common,
  key: "twitter_v2-new-user-followed-by-user",
  name: "New User Followed By User",
  description: `Emit new event when the specified user follows another user [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
    ...userFieldProps,
  },
  methods: {
    ...common.methods,
    getUserId,
    getUserFields,
    getEntityName() {
      return "User Followed";
    },
    getItemSummary,
    async getResources(customize: boolean): Promise<User[]> {
      const params: Partial<ListUserFollowingParams> = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
      };

      if (customize) {
        params.userId = this.getUserId();
        params.params = this.getUserFields();
      }

      return this.app.listUserFollowing(params);
    },
  },
});