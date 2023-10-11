import { v4 } from "uuid";

const GenId = () => {
  return v4().replaceAll("-", "");
};

export { GenId };
