import React from 'react';
import {render} from "@testing-library/react";
import {CreatePostButton} from './src/components/newPost.js';
import {TopBanner} from './src/components/banner.js';

describe("Testing CreatePostButton with a logged in user vs guest user", () => {
    test.each(
        [{status: "guest", disabledButton: true},
        {status: "logged in", disabledButton: false},])(
        "checks the create post button when the user is '$status'",
        ({status, disabledButton}) => {
        const {rendered} = render(<TopBanner userStatus={userStatus} user={user} />);
        const createPostButton = rendered.querySelector("#create-post");
        // Assert disabled/enabled state
        if (expectedDisabled) {
            expect(button).toBeDisabled();
        } else {
            expect(button).toBeEnabled();
        }
        }
    );
})

// TopBanner(userStatus, user)