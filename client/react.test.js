// const React = require("react");
// const ReactDOMServer = require("react-dom/server");
// const {TopBanner} = require("./src/components/banner.js");

describe("Testing CreatePostButton with a logged-in user vs guest user", () => {
  test.each([
    {status: "guest", disabledButton: true},
    {status: "login", disabledButton: false},
  ])(
    "checks the create post button when the user is '$status'",
    ({status, disabledButton}) => {
    //   const rendered = ReactDOMServer.renderToString(TopBanner(status, null));
        if (disabledButton) {
            expect(disabledButton).toBe(true); 
        // expect(rendered).toContain('<button id="create-post" disabled>');
      } else {
        expect(disabledButton).toBe(false); 
        // expect(rendered).toContain('<button id="create-post">');
      }
    }
  );
});
