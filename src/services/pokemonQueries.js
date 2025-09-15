import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import localforage from "localforage";
import api from "./api";

// fetch some amount of cards
export const useCards = (pageSize) => useQuery({
	queryKey: ["cards", pageSize],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `cards-${pageSize}`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get(`/cards?pageSize=${pageSize}`);
		const data = res.data.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// fetch all cards (max limit = 250)
export const useCardsAll = () => useQuery({
	queryKey: ["cards-all"],
	queryFn: async () => { // default page length = 1
		// check if data is cached in localforage
		const cacheKey = `cards-all`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get(`/cards`);
		const data = res.data.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	getNextPageParam: (lastPage) => {
		if (lastPage.page < lastPage.totalPages) {
			return lastPage.page++;
		}
		return lastPage.page;
	},
	getPreviousPageParam: (firstPage) => {
		if (firstPage.page < firstPage.totalPages) {
			return firstPage.page++;
		}
		return firstPage.page;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// fetch all cards for infinite scroll
export const useCardsInfinite = (pageSize = 15, maxPages = 25) => useInfiniteQuery({
	queryKey: ["cards-infinite", pageSize],
	queryFn: async ({ pageParam = 1 }) => { // default page length = 1
		// check if data is cached in localforage
		const cacheKey = `cards-infinite-${pageParam}-${pageSize}`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(`localforage fetch Page ${cacheData.page}`);
			return cacheData;
		} else {
			// if not cached, fetch from API and cache
			const res = await api.get(`/cards?page=${pageParam}&pageSize=${pageSize}`);
			const data = res.data;
			await localforage.setItem(cacheKey, data);
			console.log(`API fetch: Page ${data.page}`);
			return data;
		}
	},
	getNextPageParam: (lastPage) => {
		const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
		const maxTotalPages = Math.min(totalPages, maxPages);

		return lastPage.page < maxTotalPages ? lastPage.page + 1 : undefined;
	},
	getPreviousPageParam: (firstPage) => {
		return firstPage.page > 1 ? firstPage.page - 1 : undefined;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// fetch card rarities
export const useRarities = () => useQuery({
	queryKey: ["rarities"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `rarities`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/rarities");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card types
export const useTypes = () => useQuery({
	queryKey: ["types"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `types`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/types");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card supertypes
export const useSupertypes = () => useQuery({
	queryKey: ["supertypes"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `supertypes`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/supertypes");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card subtypes
export const useSubtypes = () => useQuery({
	queryKey: ["subtypes"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `subtypes`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/subtypes");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card sets
export const useSets = () => useQuery({
	queryKey: ["sets"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `sets`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/sets");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});