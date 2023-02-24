export interface Err extends Error {
  code?: string | number;
  message: string;
  statusCode: number;
  status: string;
  isOperational?: boolean;
  path?: string;
  value?: unknown;
  errors?: any;
  body?: any;
  query?: any;
  params?: any;
}
