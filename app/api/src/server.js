const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data');
const graph = require('./graph');

const router = express.Router();

router.post('/join/:channel', async (req, res) => {
    let channel = req.params.channel;
    await data.join(channel, req.userName);

    // add to graph
    await graph.createPerson(req.userName);
    await graph.createGroup(channel);
    await graph.addToGroup(req.userName, channel);

    res.send({success: true});
});

router.post('/part/:channel', async (req, res) => {
    let channel = req.params.channel;
    await data.part(channel, req.userName);

    res.send({success: true});
});

router.post('/channel/:channel', async (req, res) => {
    let channel = req.params.channel;
    let message = req.body.message;
    await data.send(channel, req.userName, message);
    res.send({success: true});
});

router.get('/channel/:channel', async (req, res) => {
    let channel = req.params.channel;
    let before = req.query.before;
    let messages = await data.getMessages(channel, before);
    res.send({success: true, messages});
});

router.get('/channel/:channel/members', async (req, res) => {
    let channel = req.params.channel;
    let members = await data.getMembers(channel);
    res.send({success: true, members});
});


// Graph APIs
router.get('/graph/graphInfo', async (req, res) => {
    let graphInfo = await graph.getGraphInfo();
    res.send({success: true, graphInfo});
});

router.get('/graph/entities', async (req, res) => {
    let entities = await graph.getEntities();
    res.send({success: true, entities});
});

router.post('/graph/addPerson', async (req, res) => {
    let response = await graph.createPerson(req.userName);
    res.send({success: true, response});
});

router.post('/graph/:channel', async (req, res) => {
    let channelName = req.params.channel;
    let response = await graph.createGroup(channelName);
    res.send({success: true, response});
});

router.post('/graph/:channel/members', async (req, res) => {
    let channelName = req.params.channel;
    await data.join(channelName, req.userName);
    let response = await graph.addToGroup(req.userName, channelName);
    res.send({success: true, response});
});

router.get('/graph/:channel/members', async (req, res) => {
    let channelName = req.params.channel;
    let response = await graph.getGroupMembers(channelName);
    res.send({success: true, response});
});

const clientRoot = path.join(process.cwd(), '../client/dist');

const app = express();

app.use((req, res, next) => {
    req.userName = req.get('x-username');
    next();
});

app.use(bodyParser.json());
app.use('/api', router);
app.use(express.static(clientRoot));
app.use((req, res) => res.sendFile(`${clientRoot}/index.html`));

const server = app.listen(+process.env.PORT || 3000);

process.on('SIGINT', () => {
    server.close(() => {
        process.exit();
    });
});

module.exports = server;

