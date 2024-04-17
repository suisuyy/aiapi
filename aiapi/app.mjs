
import fetch, { FormData, fileFromSync } from 'node-fetch';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

let port=process.env.PORT || 3000


const app = express();
//const upload = multer({ dest: 'uploads/' });

let corsp = 'https://corsp.suisuy.eu.org?';
const apiKey='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJzdWlzdXl1c0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJwb2lkIjoib3JnLU9oaDh6ODZUUkc5d0dVQkpReENQYU1XaSIsInVzZXJfaWQiOiJ1c2VyLWZEUHpVNk5naXJmVGFVRExpZEVkZmczdyJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTc3NjE3NTQ0MjY5MDcyMzEwNzIiLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzEyNjUyNTQxLCJleHAiOjE3MTM1MTY1NDEsImF6cCI6ImRCUFlQSFg4eEdUdWVwTmhYWkpDeWN3c3lzdERzdzdZIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb3JnYW5pemF0aW9uLndyaXRlIG9mZmxpbmVfYWNjZXNzIn0.JtfWhW1T-cPjcbKVA3KdtB3M5nLQ9lmIp_Sgj1DmdLVxsK1czAggeoMw5m0kf3jCi8PX_YxkzL6ipSqAULk_iQQIHwNeNRNz8iSseoGGRZr6W1RTUiC4_aXjnMfxGB90rPCQOUXGlovLRMZpW1X7EtmqllR6yeYxbmhqSa8mNVEl-QCdavukhgdiGoI71dpbnPIOl55MiMrwy6KD4W58giHbh7V-y7Y-PBNMv6FIZwOLyqy3bXeqEP-7SP2P3vH0xeN6zxpFtuDORl9Tz_MnjDa5eGvFiT2axEg8vvEYFRH-1yqV6k6LCPjpxbrPb7lbJuFRJSRIw3tfyo18OiLvoQ';
let cookie='_playintegrity=370cdd22-cd55-4725-8624-fb06d062da5c_user-fDPzU6NgirfTaUDLidEdfg3w:1713156539-I9fkD5h9ZHLcpvr9r3CBwzLs0zOF3TLJa88O7XiQjNU%3D; _cfuvid=i3qjYMWHvw_KH2Pa.7cR_55KzZbNoV1gQ2g7rwa47bI-1713156539950-0.0.1.1-604800000'


corsp=''

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // specify where to store uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // specify file name
    }
  });
  
  const upload = multer({ storage: storage });

app.get('/',async(req,res)=>{
  res.json({
    'status':'ok'
  })
})

app.post('/transcribe', upload.single('file'), async (req, res) => {
    req.file.filename='audio.mp3'
    console.log(req.file);
    const form = new FormData();
    form.append('file', fileFromSync(req.file.path));
    console.log(form);

    const startTime = Date.now();
    const response = await fetch(corsp + 'https://android.chat.openai.com/backend-api/transcribe', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Cookie': cookie,
      },
      body: form,
    });

    const result = await response.json();
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    console.log(result, elapsedTime);

    res.json(result);
   
    // Clean up the uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    
  }
});

app.listen(port, () => {
  console.log('Server is running on port '+port);
});
