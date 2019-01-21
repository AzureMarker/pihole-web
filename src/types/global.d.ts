namespace NodeJS {
  interface Global {
    tick(): Promise<any>
    ignoreAPI(): Promise<any>
  }
}
