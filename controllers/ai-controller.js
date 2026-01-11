const { default: OpenAI } = require("openai");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require('../utils/httpStatusText')
const Product = require('../models/products-model')
const appError = require("../utils/appError");
 const openai = new OpenAI({
  apiKey:process.env.AI_KEY
 })



const askAI = asyncWrapper(async(req , res , next )=>{

      const {question} = req.body

      if(!question){

        const error = appError.create('please enter your question' ,400,httpStatusText.FAIL)
        return next(error)

      }

      const q = question.toLowerCase()
      let result = {
        source : null,
        products:[],
        aiAnswer:null

      }
      if (q.includes('wig') || q.includes('product')){
        const products = await Product.find({
          $or:[
            {title:{$regex:'wig',$options:"i"}},
            {category:{$regex:"wig",$options:"i"}}
          ]
        }).limit(5)
        result.source = 'database'
        result.products = products

        return res.status(200).json(result)
      }
      

      
      

      const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo-16k-0613',
        messages:[
          {
            role:'system',
            content:'you are a helpful beatuy and wig assistant'
          },
          {
            role:'user',
            content:question
          }
        ]
      })

      result.aiAnswer = response.choices[0].message.content

      return res.status(200).json(result)


  
})



module.exports= {askAI}






