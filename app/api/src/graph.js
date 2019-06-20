const RedisGraph = require("./redisgraph/redisGraph");
const graph = new RedisGraph("social");

async function getGraphInfo () {
    return (await graph.query("MATCH (a)-[e]->(b) RETURN DISTINCT LABELS(a), TYPE(e), LABELS(b)"));
}

async function getEntities () {
    return (await graph.query("MATCH (e) RETURN e.name, LABELS(e) as label ORDER BY label, e.name"));
}

async function createPerson (userName) {
	var query = `CREATE (:person{name:'${userName}'})`;
	//console.log(query);
    return (await graph.query(query));
}

async function createGroup (groupName) {
	var query = `CREATE (:group{name:'${groupName.toLowerCase()}'})`;
	//console.log(query);
    return (await graph.query(query));
}

async function addToGroup (userName, groupName) {
	var query = `MATCH (a:person), (b:group) WHERE (a.name = '${userName}' AND b.name= '${groupName.toLowerCase()}') CREATE (a)-[:belongto]->(b)`;
	//console.log(query);
    return (await graph.query(query));
}

async function getGroupMembers (groupName) {
	var query = `MATCH (a:person)-[:belongto]->(g:group) WHERE g.name = '${groupName.toLowerCase()}' RETURN a.name`;
	//console.log(query);
    return (await graph.query(query));
}

exports.getGraphInfo = getGraphInfo;
exports.getEntities = getEntities;
exports.createPerson = createPerson;
exports.createGroup = createGroup;
exports.addToGroup = addToGroup;
exports.getGroupMembers = getGroupMembers;