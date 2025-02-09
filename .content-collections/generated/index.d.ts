import configuration from "../../content.config.ts";
import { GetTypeByName } from "@content-collections/core";

export type Post = GetTypeByName<typeof configuration, "Post">;
export declare const allPosts: Array<Post>;

export type Project = GetTypeByName<typeof configuration, "Project">;
export declare const allProjects: Array<Project>;

export {};
