import { exists, ensureDir } from "https://deno.land/std@0.91.0/fs/mod.ts"
import { join } from "https://deno.land/std@0.91.0/path/mod.ts"
import { logSymbols } from "https://deno.land/x/log_symbols@v0.1.0/mod.ts"
import { parse } from "https://deno.land/std/flags/mod.ts"
import { AsyncRay } from "https://deno.land/x/async_ray/mod.ts"
import { Figures } from "https://raw.githubusercontent.com/c4spar/deno-cliffy/v0.8.2/packages/prompt/lib/figures.ts"

// --------------------------------------------------------------------
// CSV -> JSON
// --------------------------------------------------------------------

// Args
const { _: inDir = [], out: outDir = 'out', help = false } = parse(Deno.args)

if (help || inDir.length == 0) {
    console.log(
`usage: csv2json [options] directories

Options:
    --out Output Directory; default: 'out/'
`
    )
    Deno.exit(0)
}

const dirIn = inDir as string[]
// checks if directory exists
if (await AsyncRay(dirIn).aReduce(async (p, v) => p === 'error' || ! await exists(v) ? 'error': '' as string, '')) {
    console.log(`${logSymbols.error} Directory not found!`)
    Deno.exit(1) 
}

// gets CSV files of the directory dirIn
const files: {path: string, file: string}[] = []
for await (const dir of dirIn) {
    for await (const file of Deno.readDir(dir)) {
        if (file.isFile && /\.csv/.test(file.name))
            files.push({ path: join(dir, file.name), file: file.name })
    }
}
    


const dirOut = outDir as string
await ensureDir(dirOut)

// Converts CSV files to JSON files and save them to dirOut
await Promise.all( files.map( file => (async ({path, file}: {path: string, file: string}) => {    
    const out = await csvToArray(path)
    await Deno.writeTextFile(join(dirOut, `${file.replace('.csv', '')}.json`), JSON.stringify({data: out}))
    console.log(`${logSymbols.success} "${path}" 🡆 "${join(dirOut, `${file.replace('.csv', '')}.json`)}"`)
})(file)))

Deno.exit()

/**
 * Converts a CSV Table with headers in the first line to Array of objects
 */
async function csvToArray(csv: string): Promise<Array<{ date: string, time: string, [key: string]: string | number }>> {
    const csvText = (await Deno.readTextFile(csv)).split(/\n/)
    
    const headers: string[] = ((line: string) => line.split(/\t/g).map(item => item === 'Date' ? 'date' : item === 'Time' ? 'time': item) )(csvText.shift() as string)
    
    const array: Array<{ date: string, time: string, [key: string]: string | number }> = []

    csvText.forEach(line => {        
        const fields = line.split(/\t/g)
    
        let index = 0
        let obj : { [key: string]: string | number } = {}

        fields.forEach(field => {
            if (field === '') return

            obj[headers[index]] = field

            index++
        })
        array.push(obj as { date: string, time: string, [key: string]: string | number })
    })

    return array
}