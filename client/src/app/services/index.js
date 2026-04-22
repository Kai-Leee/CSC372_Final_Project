import { authService } from "./authService";
import { taskService } from "./taskService";
import { marketService } from "./marketService";

export const appService = {
  auth: authService,
  tasks: taskService,
  market: marketService,
};

