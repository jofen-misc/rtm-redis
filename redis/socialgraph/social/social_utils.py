import csv
import os
from redisgraph import Node, Edge


graph_name = "social"


def populate_graph(redis_con, redis_graph):
    if redis_con.exists(graph_name):
        return

    # dictionary person name to its node entity
    persons = {}
    # dictionary groups name to its node entity
    groups = {}

    # Create group entities
    with open(os.path.dirname(os.path.abspath(__file__)) + '/resources/groups.csv', 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            name = row[0]
            node = Node(label="group", properties={"name": name})
            groups[name] = node
            redis_graph.add_node(node)

    # Create person entities
    with open(os.path.dirname(os.path.abspath(__file__)) + '/resources/person.csv', 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            name = row[0]
            age = int(row[1])
            gender = row[2]
            status = row[3]
            node = Node(label="person", properties={"name": name,
                                                    "age": age,
                                                    "gender": gender,
                                                    "status": status})

            persons[name] = node
            redis_graph.add_node(node)

    # Connect people to groups they belong to.
    with open(os.path.dirname(os.path.abspath(__file__)) + '/resources/belongs.csv', 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            person = row[0]
            group = row[1]
            reason = row[2]
            edge = Edge(persons[person],
                        "belongto",
                        groups[group],
                        properties={'joinmeta': reason})
            redis_graph.add_edge(edge)

    # Connect friends
    with open(os.path.dirname(os.path.abspath(__file__)) + '/resources/friends.csv', 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            person = persons[row[0]]
            friend = persons[row[1]]
            edge = Edge(person, "friend", friend)
            redis_graph.add_edge(edge)

    redis_graph.commit()
