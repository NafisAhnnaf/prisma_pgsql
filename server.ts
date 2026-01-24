import express from 'express';
import "dotenv/config";
import cors from 'cors'
import routes from './routes/index.ts'
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const PORT = parseInt(process.env.PORT!) || 8000;
const HOST = process.env.HOST || '127.0.0.1';

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
    console.log(req.method, req.url);
    next();
});
const get_endpoints = [
    { name: "GET Users", route: 'http://localhost:8000/api/users' },
    { name: "GET Posts", route: 'http://localhost:8000/api/posts' },
    { name: "GET Events", route: 'http://localhost:8000/api/events' },
    { name: "GET Announcements", route: 'http://localhost:8000/api/announcements' },
    { name: "GET Departments", route: 'http://localhost:8000/api/departments' },
    { name: "GET Members", route: 'http://localhost:8000/api/members' },
    { name: "GET Club Appointments", route: 'http://localhost:8000/api/appointments/club' },
    { name: "GET Club Appointments", route: 'http://localhost:8000/api/appointments/executive' },
    // { name: "GET Admins", route: '/api/users/admin' }
]
// const div = (array: Array<Record<string, string>>) => {
//     let tag = "<p>API is up and running</p>"
//     tag += "<div style='width:100vw; height: 80vh; display:flex; flex-direction:column; justify-content:center; align-items: center'>";

//     tag += "<h2>Endpoints</h2>"
//     tag += "<div>"
//     array.map((e, index) => {
//         tag += (`<a href="${e.route}">${e.name}</a>`)
//         tag += "<br/>"
//     })
//     tag += "</div>"
//     tag += ("</div>")
//     return tag;
// }
app.get('/', (req: Request, res: Response) => {
    res.set('Content-Type', 'application/json')
    // res.send(div(get_endpoints));
    res.json(get_endpoints);
})
app.use('/api', routes);

app.listen(PORT, HOST, () => {
    console.log("Listening on localhost:" + PORT);
});