export const fixName = (text: string[]):string =>{
  const sample = text[0];
  //remove any new line characters ('team 1' is often on a separate line)
  const noNewLine = sample.split(/\n/)[0];
  //now remove the clan tag if there is one
  const noClanTag = noNewLine.split(' ');
  const res = noClanTag.length ? noClanTag.pop() as string : '';
  return res
  
}
