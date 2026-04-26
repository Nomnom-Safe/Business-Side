'use strict';

const fs = require('fs');
const path = require('path');

let idSeq = 1;
const STORE_FILE = path.resolve(__dirname, '../../.dev-demo-store.json');

function nextId(prefix) {
	idSeq += 1;
	return `${prefix}_${Date.now()}_${idSeq}`;
}

const defaultStore = {
	users: [
		// Created through signup in demo mode.
	],
	addresses: [
		{
			id: 'addr_demo_1',
			street: '123 Demo St',
			city: 'Seattle',
			state: 'WA',
			zipCode: '98101',
		},
	],
	businesses: [
		{
			id: 'biz_demo_1',
			name: 'Demo Bistro',
			address_id: 'addr_demo_1',
			hours: [],
			phone: '',
			website: 'None',
			disclaimers: [],
			cuisine: '',
			menu_id: 'menu_demo_1',
			allergens: [],
			diets: [],
		},
	],
	menus: [
		{
			id: 'menu_demo_1',
			business_id: 'biz_demo_1',
			title: 'Your Menu',
		},
	],
	menuItems: [],
	allergens: [
		{ id: 'all_gluten', label: 'Gluten' },
		{ id: 'all_dairy', label: 'Dairy' },
		{ id: 'all_egg', label: 'Egg' },
		{ id: 'all_soy', label: 'Soy' },
		{ id: 'all_peanut', label: 'Peanut' },
		{ id: 'all_tree_nut', label: 'Tree nut' },
		{ id: 'all_fish', label: 'Fish' },
		{ id: 'all_shellfish', label: 'Shellfish' },
		{ id: 'all_sesame', label: 'Sesame' },
	],
};

function cloneDefaultStore() {
	return JSON.parse(JSON.stringify(defaultStore));
}

function loadPersistedStore() {
	try {
		if (!fs.existsSync(STORE_FILE)) return cloneDefaultStore();
		const raw = fs.readFileSync(STORE_FILE, 'utf8');
		const parsed = JSON.parse(raw);
		return {
			...cloneDefaultStore(),
			...parsed,
		};
	} catch (err) {
		console.warn('DEV_DEMO_MODE: failed to load persisted demo store, using defaults.');
		return cloneDefaultStore();
	}
}

function persistStore() {
	try {
		fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
	} catch (err) {
		console.warn('DEV_DEMO_MODE: failed to persist demo store.');
	}
}

const store = loadPersistedStore();

module.exports = {
	store,
	nextId,
	persistStore,
};
