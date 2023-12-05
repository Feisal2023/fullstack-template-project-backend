const welcomeEmail = (name) => {
  const email = {
    body: {
      name: name,
      intro: [
        "Thank you for registering on our website.",
        "We're very excited to have you on board.",
      ],

      action: {
        instructions: "Please take a minute to complete your profile.",
        button: {
          color: "#3869D4", // Optional action button color
          text: "Go to Dashboard",
          link: "https://olink.to/courses",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  return email;
};
export { welcomeEmail };
