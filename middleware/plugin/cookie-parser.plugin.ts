import cookieParser from "cookie-parser"
import { COOKIE_SECRET } from "../../environment"


const cookieParserPlugin = cookieParser(COOKIE_SECRET)


export default cookieParserPlugin
