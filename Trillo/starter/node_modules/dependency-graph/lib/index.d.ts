declare module 'dependency-graph' {
  export class DepGraph<T> {
    /**
     * add a node in the graph with optional data. If data is not given, name will be used as data
     * @param {string} name
     * @param data
     */
    addNode(name: string, data?: T): void;

    /**
     * remove a node from the graph
     * @param {string} name
     */
    removeNode(name: string): void;

    /**
     * check if a node exists in the graph
     * @param {string} name
     */
    hasNode(name: string): boolean;

    /**
     * get the data associated with a node (will throw an Error if the node does not exist)
     * @param {string} name
     */
    getNodeData(name: string): T;

    /**
     * set the data for an existing node (will throw an Error if the node does not exist)
     * @param {string} name
     * @param data
     */
    setNodeData(name: string, data?: T): void;

    /**
     * add a dependency between two nodes (will throw an Error if one of the nodes does not exist)
     * @param {string} from
     * @param {string} to
     */
    addDependency(from: string, to: string): void;

    /**
     * remove a dependency between two nodes
     * @param {string} from
     * @param {string} to
     */
    removeDependency(from: string, to: string): void;

    /**
     * get an array containing the nodes that the specified node depends on (transitively). If leavesOnly is true, only nodes that do not depend on any other nodes will be returned in the array.
     * @param {string} name
     * @param {boolean} leavesOnly
     */
    dependenciesOf(name: string, leavesOnly?: boolean): string[];

    /**
     * get an array containing the nodes that depend on the specified node (transitively). If leavesOnly is true, only nodes that do not have any dependants will be returned in the array.
     * @param {string} name
     * @param {boolean} leavesOnly
     */
    dependantsOf(name: string, leavesOnly?: boolean): string[];

    /**
     * construct the overall processing order for the dependency graph. If leavesOnly is true, only nodes that do not depend on any other nodes will be returned.
     * @param {boolean} leavesOnly
     */
    overallOrder(leavesOnly?: boolean): string[];
  }
}
