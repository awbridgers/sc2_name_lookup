export const fixString = (text:string | null) =>{
  if(text === null){
    return 'N/A'
  }
  const fixMe = text.toLowerCase();
  const first = fixMe.charAt(0);
  const rest = fixMe.substring(1);
  return `${first.toLocaleUpperCase()}${rest}`
}