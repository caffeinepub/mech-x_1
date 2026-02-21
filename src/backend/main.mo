import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type definitions
  public type Role = { #admin; #user };

  public type Mechanic = {
    name : Text;
    contactDetails : Text;
    latitude : Float;
    longitude : Float;
    specialization : Text;
    rating : Float;
  };

  public type CarIssue = {
    make : Text;
    model : Text;
    year : Nat;
    issue : Text;
    solution : Text;
  };

  public type Location = {
    latitude : Float;
    longitude : Float;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  module Mechanic {
    public func compare(m1 : Mechanic, m2 : Mechanic) : Order.Order {
      Text.compare(m1.name, m2.name);
    };
  };

  // Initialize mechanic database
  let mechanics = Map.empty<Text, Mechanic>();
  let carIssues = Map.empty<Nat, CarIssue>();
  let nextIssueId = Map.empty<Nat, ()>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization module
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Mechanic CRUD operations
  public shared ({ caller }) func addMechanic(id : Text, mechanic : Mechanic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add mechanics");
    };
    mechanics.add(id, mechanic);
  };

  public shared ({ caller }) func updateMechanic(id : Text, mechanic : Mechanic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update mechanics");
    };
    switch (mechanics.get(id)) {
      case (null) { Runtime.trap("Mechanic not found") };
      case (?_) { mechanics.add(id, mechanic) };
    };
  };

  public shared ({ caller }) func deleteMechanic(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete mechanics");
    };
    switch (mechanics.get(id)) {
      case (null) { Runtime.trap("Mechanic not found") };
      case (?_) { mechanics.remove(id) };
    };
  };

  public query ({ caller }) func getMechanic(id : Text) : async Mechanic {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mechanic details");
    };
    switch (mechanics.get(id)) {
      case (null) { Runtime.trap("Mechanic not found") };
      case (?mechanic) { mechanic };
    };
  };

  // Car troubleshooting management
  public shared ({ caller }) func addCarIssue(carIssue : CarIssue) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add car issues");
    };
    let newId = carIssues.size();
    carIssues.add(newId, carIssue);
    nextIssueId.add(newId, ());
    newId;
  };

  public query ({ caller }) func getCarIssue(id : Nat) : async CarIssue {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view car issues");
    };
    switch (carIssues.get(id)) {
      case (null) { Runtime.trap("Car issue not found") };
      case (?issue) { issue };
    };
  };

  public query ({ caller }) func findCarIssues(make : Text, model : Text, year : Nat, issue : Text) : async [CarIssue] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search car issues");
    };
    carIssues.values().toArray().filter(
      func(carIssue) {
        carIssue.make == make and carIssue.model == model and carIssue.year == year and carIssue.issue.contains(#text issue);
      }
    );
  };

  // Location-based mechanic recommendation
  public query ({ caller }) func findNearbyMechanics(location : Location, maxDistance : Float) : async [Mechanic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search for nearby mechanics");
    };
    let nearby = mechanics.values().toArray().filter(
      func(mechanic) {
        calculateDistance(location, { latitude = mechanic.latitude; longitude = mechanic.longitude }) <= maxDistance;
      }
    );
    nearby.sort();
  };

  // Helper function to calculate distance between locations (in kilometers)
  func calculateDistance(loc1 : Location, loc2 : Location) : Float {
    let earthRadius : Float = 6371.0;
    let dLat = (loc2.latitude - loc1.latitude) * 3.14159265359 / 180.0;
    let dLon = (loc2.longitude - loc1.longitude) * 3.14159265359 / 180.0;
    let a = 0.5 - Float.cos(dLat) / 2.0 + Float.cos(loc1.latitude * 3.14159265359 / 180.0) * Float.cos(loc2.latitude * 3.14159265359 / 180.0) * (1.0 - Float.cos(dLon)) / 2.0;
    2.0 * earthRadius * Float.sqrt(a);
  };
};
