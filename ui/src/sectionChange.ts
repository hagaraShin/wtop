

export function swapSection(attach: (arg: HTMLElement)=>void): (e: MouseEvent)=>void {
  return (e) =>{
    const target = e.currentTarget as HTMLDivElement
    const children = target.children
    for(let i = 0; i < children.length; i++) {
      children.item(i)?.remove()
    }
    attach(target)
  }
}
