import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { FollowUserParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/post-users-source_user_id-following";

export default defineAction({
  key: "twitter_v2-follow-user",
  name: "Follow User",
  description: `Follow a user. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
  },
  methods: {
    getUserId,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();
    if (!userId) throw new Error("User not found");

    const params: FollowUserParams = {
      $,
      data: {
        target_user_id: userId,
      },
    };

    const response = await this.app.followUser(params);

    $.export(
      "$summary",
      `Successfully ${
        response.following
          ? "followed"
          : "requested to follow"
      } user`,
    );

    return response;
  },
});