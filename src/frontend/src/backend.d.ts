import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    longitude: number;
}
export interface CarIssue {
    model: string;
    make: string;
    year: bigint;
    solution: string;
    issue: string;
}
export interface Mechanic {
    latitude: number;
    name: string;
    longitude: number;
    specialization: string;
    rating: number;
    contactDetails: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCarIssue(carIssue: CarIssue): Promise<bigint>;
    addMechanic(id: string, mechanic: Mechanic): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMechanic(id: string): Promise<void>;
    findCarIssues(make: string, model: string, year: bigint, issue: string): Promise<Array<CarIssue>>;
    findNearbyMechanics(location: Location, maxDistance: number): Promise<Array<Mechanic>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCarIssue(id: bigint): Promise<CarIssue>;
    getMechanic(id: string): Promise<Mechanic>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMechanic(id: string, mechanic: Mechanic): Promise<void>;
}
