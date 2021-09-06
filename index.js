const http = require('http');
const mongoose = require('mongoose');

var DB = "mongodb+srv://PradeepNegi:pradeep@cluster0.b56v9.mongodb.net/NodeConnect?retryWrites=true&w=majority";
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connection Successfull')
}).catch((err) => console.log(err));

const userData = new mongoose.Schema({
    Name: {
        type: String
    },
    Email: {
        type: String
    },
    Phone: {
        type: Number
    },
    Designation: {
        type: String
    }
})

const Employee = mongoose.model('EmployeeData', userData);

http.createServer(async (request, response) => {

    if (request.url == "/Read" && request.method == "POST") {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        let One = '';
        request.on('data', chunk => {
            One += chunk.toString();
        });
        request.on('end', async () => {
            One = JSON.parse(One);
            let data = One;
            const { Name, Email, Phone, Designation } = data;
            try {
                const Data = new Employee({ Name, Email, Phone, Designation });
                const Save = await Data.save();
                console.log(Save);
            } catch (err) {
                console.log(err);
            }
            response.end(request.body);
        });
    } else if (request.url == "/GetData" && request.method == "GET") {
        response.writeHead(200, { 'Content-Type': 'application/json' });
       try{
        Employee.find({}, (err, employeelist) => {
            if (err) {
                console.log(err);
            } else {
                console.log(employeelist);
                response.write(JSON.stringify(employeelist));
                response.end();
            }
        });
    }catch(err){
        response.end("404 not found")
    }
    response.end("404 not found")
    
    } else if (request.url.match(/\/Delete\/([0-9]+)/) && request.method == "DELETE") {
        const _id = request.url.split("/")[2];
        console.log(_id)
        
        response.writeHead(200, { 'Content-Type': 'application/json' });
         try{
            Employee.findByIdAndRemove(_id, (err, result) => {
            if (err) {
                response.end("404 Id Not found");
            } else {
                console.log(result);
                response.end("404 not found");
            }
        })
    }catch(err){
        response.end("404 not found");
    }
    response.end("404 not found")
    }
    else if (request.url.match(/\/Update\/([0-9]+)/) && request.method == "PATCH") {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        const _id = request.url.split("/")[2];
        console.log(_id);
        let Updatedata = '';
        request.on('data', chunk => {
            Updatedata += chunk.toString();
        });
        request.on('end', async () => {
            Updatedata = JSON.parse(Updatedata);
            let data = Updatedata;
            const { Name, Email, Phone, Designation } = data;
            try {
                const updated = Employee.updateOne({_id,Name, Email, Phone, Designation}, (err, data) => {
                    if (err) {
                        response.end(err);
                    } else {
                        console.log(data)
                        // response.end(JSON.stringify(updated));
                    }
                })
            } catch (err) {
                response.end("404 Data Not Found");
            }
        });
        response.end("Updated");
    }else{
        response.end("404 no EndPoint Found");
    }


}).listen(8081);
console.log('Server Running...');
module.exports = Employee;