import os from "node:os";

export const cpuLength = os.cpus().length;

interface NodeEnv {
  production: string;
  development: string;
}

export const nodeEnv: NodeEnv = {
  production: "production",
  development: "development",
};
