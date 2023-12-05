import jwt from "jsonwebtoken";
function getNameFromEmail(email) {
  // use the regular expression to match everything before "@"" symbol
  const regex = /^(.*?)@/;
  const match = email.match(regex);

  // check if the match was found
  if (match) {
    // return the part before "@" username
    return match[1];
  } else {
    // if their is no match return the original email
    return email;
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { getNameFromEmail, generateToken };
