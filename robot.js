// Define the roads between different locations
const roads = [
	"Alice's House-Bob's House",
	"Alice's House-Cabin",
	"Alice's House-Post Office",
	"Bob's House-Town Hall",
	"Daria's House-Ernie's House",
	"Daria's House-Town Hall",
	"Ernie's House-Grete's House",
	"Grete's House-Farm",
	"Grete's House-Shop",
	"Marketplace-Farm",
	"Marketplace-Post Office",
	"Marketplace-Shop",
	"Marketplace-Town Hall",
	"Shop-Town Hall",
];

// Build the graph representation of the roads
function buildGraph(edges) {
	let graph = Object.create(null);

	// Function to add edges to the graph
	function addEdge(from, to, distance) {
		if (graph[from] == null) {
			graph[from] = [{ to, distance }];
		} else {
			graph[from].push({ to, distance });
		}
	}

	// Process each road and add edges to the graph in both directions
	for (let [from, to] of edges.map((r) => r.split("-"))) {
		let distance = Math.floor(Math.random() * 5) + 1; // Generate random distance between 1 and 5
		addEdge(from, to, distance);
		addEdge(to, from, distance);
	}

	return graph;
}

// Robot class for managing deliveries
class Robot {
	constructor(size, graph) {
		this.deliveries = this.makeDeliveryList(size, graph);
		this.distance = 1;
	}

	// Generate a list of random deliveries
	makeDeliveryList(size, graph) {
		let deliveries = {
			list: [],
			state: [],
		};
		const locations = Object.keys(graph);

		for (let i = 0; i < size || deliveries.list.length < size; i++) {
			let from = locations[Math.floor(Math.random() * locations.length)];
			let to = locations[Math.floor(Math.random() * locations.length)];
			if (from !== to) {
				deliveries.list.push([from, to]);
			}
		}
		deliveries.state = deliveries.list.map(() => "undelivered");
		return deliveries;
	}
}

// Build the road graph using the defined roads
const roadGraph = buildGraph(roads);

// Create a robot with 1 delivery and the road graph
let robot1 = new Robot(1, roadGraph);
console.log(robot1);
console.log(roadGraph);

// Dijkstra algorithm to find the shortest path
function Dijkstra(delivery, roadGraph) {
	const [from, to] = delivery;

	// Create a map to track the current distance, exploration status, and last location for each location
	let map = Object.assign(
		{},
		...Object.keys(roadGraph).map((key) => ({
			[key]: { current: Infinity, explored: false, last: undefined },
		}))
	);

	// Set the current location distance to 0 and mark it as explored
	map[from].current = 0;
	map[from].explored = true;

	let queue = [from]; // Queue to keep track of locations to explore

	while (queue.length > 0) {
		let currentLocation = queue.shift();

		if (currentLocation === to) {
			// Build the path array by traversing the "last" property from "to" to "from"
			let path = [currentLocation];
			while (path[0] !== from) {
				path.unshift(map[path[0]].last);
			}
			return { path, distance: map[to].current };
		}

		// Explore the neighbors of the current location
		for (let neighborObj of roadGraph[currentLocation]) {
			let neighbor = neighborObj.to;
			let distance = neighborObj.distance;
			let newDistance = map[currentLocation].current + distance;

			// Update the distance and last location if a shorter path is found
			if (newDistance < map[neighbor].current) {
				map[neighbor].current = newDistance;
				map[neighbor].last = currentLocation;
			}

			// Add the neighbor to the queue if it has not been explored
			if (!map[neighbor].explored) {
				map[neighbor].explored = true;
				queue.push(neighbor);
			}
		}
	}

	// If no path is found, return an empty path and distance Infinity
	return { path: [], distance: Infinity };
}

// Example delivery from "Shop" to "Alice's House"
let delivery = ["Shop", "Alice's House"];
let result = Dijkstra(delivery, roadGraph);
console.log(result);
