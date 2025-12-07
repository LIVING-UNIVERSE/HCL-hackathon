import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDBconfig.js'

import userRouter from './routes/userRoute.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const port = process.env.PORT || 4000
connectDB();


app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send('API is working just fine'));

app.listen(port,()=>{ console.log (`Server is running on port ${port}`) })

export default app