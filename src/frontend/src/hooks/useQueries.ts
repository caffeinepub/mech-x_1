import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Mechanic, CarIssue, Location, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllMechanics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<{ id: string; mechanic: Mechanic }>>({
    queryKey: ['mechanics'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have getAllMechanics, we'll need to track IDs separately
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddMechanic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mechanic }: { id: string; mechanic: Mechanic }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMechanic(id, mechanic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyMechanics'] });
    },
  });
}

export function useUpdateMechanic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mechanic }: { id: string; mechanic: Mechanic }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMechanic(id, mechanic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyMechanics'] });
    },
  });
}

export function useDeleteMechanic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMechanic(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyMechanics'] });
    },
  });
}

export function useFindNearbyMechanics(location: Location | null, maxDistance: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Mechanic[]>({
    queryKey: ['nearbyMechanics', location?.latitude, location?.longitude, maxDistance],
    queryFn: async () => {
      if (!actor || !location) return [];
      return actor.findNearbyMechanics(location, maxDistance);
    },
    enabled: !!actor && !actorFetching && !!location,
  });
}

export function useFindCarIssues(make: string, model: string, year: bigint, issue: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CarIssue[]>({
    queryKey: ['carIssues', make, model, year.toString(), issue],
    queryFn: async () => {
      if (!actor) return [];
      return actor.findCarIssues(make, model, year, issue);
    },
    enabled: !!actor && !actorFetching && !!make && !!model && !!issue,
  });
}

export function useAddCarIssue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carIssue: CarIssue) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCarIssue(carIssue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carIssues'] });
    },
  });
}
