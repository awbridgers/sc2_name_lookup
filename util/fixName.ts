export const fixName = (text: string[]):string =>{
  if(text.length === 0) return '';
  const sample = text[0];
  //remove any new line characters ('team 1' is often on a separate line)
  const noNewLine = sample.split(/\n/)[0];
  //now remove the clan tag if there is one
  const noClanTag = noNewLine.split(' ');
  const res = noClanTag.pop()!
  return res
  
}
