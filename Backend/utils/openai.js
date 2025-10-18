import 'dotenv/config';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const getOpenAIAPIResponse=async(message)=>{
const options={ 
            method: "POST",
            headers:{ "Content-Type": "application/json", },
            body: JSON.stringify({
            contents: [
              { 
                parts:[
                { 
                  text:message, 
                }] 
              }]
           })
         }   
  try{
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,options);
       const data=await response.json();
      return data.candidates[0].content.parts[0].text;
     }catch(e){
           console.log(e); 
    }
}
export default getOpenAIAPIResponse;