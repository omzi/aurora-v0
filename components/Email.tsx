
interface EmailProps{
    url?: string
}
export default  function Email({url}: EmailProps) {
   
  return (
    <div>
        <h1>hello</h1>
        <a href={url}>click here</a>
    </div>
  )
        
  
}
