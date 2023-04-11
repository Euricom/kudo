import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {

    await prisma.template.deleteMany()

    await prisma.template.createMany({
        data: [
            {
                Title: 'Good job',
                Color: '#FF0000',
                Sticker: "Heart",
            },
            {
                Title: 'Well done',
                Color: '#00FF00',
                Sticker: "Smile",
            },
            {
                Title: 'Terrific!',
                Color: '#0000FF',
                Sticker: "ThumbsUp",
            },
        ]
    })

    const imageid = await prisma.image.create({
        data: {
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwAAAAIACAYAAAA19gs6AAAgAElEQVR4Xu3dCfQl04E/8IsYI4ilJTKhkRNCGFvE2LexhCT2LWYYS0fs0WgixhaamLZEbIldMKFDkJHYl2gSa0JzxAiGDhLGkhwmkUjwz339f+3185Z671XVq1f1qXNyJjOq7vK592fut96tqllCePfd4CBAgAABAgQIECBAoBICswgAlRhnnSRAgAABAgQIECBQExAATAQCBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECgsAJf+crMTfvhD0OYNq2wzdUwAgQIjISAADASw6SRBAgQqIbA2muHcPTRISy1VAiLLNK6z3/8YwhPPRXCBReEcPrp1XDppZeNoemll0KYPLmXq51LgEAVBASAKoyyPhIgQGAEBOLd/c03T97QGASWWcYvAnWxM84IYb/93u/36qsh7LuvIJB8ZjmTQPkFBIDyj7EeEiBAoNACiy0Wwi23hLDkkr0384AD/ApQV3vllRDGjGlt+MgjIaywQu++riBAoJwCAkA5x1WvCBAgMDIC99wTwmqr9ddcAeA9t1/9qn2IevLJED75yf6MXUWAQPkEBIDyjakeEegosMMOISy0UPGQ7FUu3pg0tijuK99gg/f+L1OnhnDUUYO3+dhjQzjy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HFV9IpChQNYBIDa90wPBrboW776+8MLM/2SBBdp/XKy5jF63FgkA1QsAscedxj2tP7le52KSUFo/p9dfutLqk3IIECiegABQvDHRIgKFFsgjAMQHI+NDv/GOfR5HrwsjAaCaASD2utNrQQedq4M8AJwknPQ6zwftj+sJECiugABQ3LHRMgKFFMgjAPRyV3NQpH4WXQJAdQNA7HmSxXav83LQt1x1+pieXwB6HQ3nEyi/gABQ/jHWQwKpCuQZAGLD4x7++G70dt8I6LdzceF/+eUz79NOWlanxdagC7lObZg6tf2vIlne3f3DH1o/OxHbOsvf/r9IP0enRXQafWk3T+N2sbnm6qfFM18Tnwk45JCZ3+DTT6nxod9x4wbfm5/kGYV+x6qffrmGAIFiCwgAxR4frSNQOIH4sGF8kHHMmPea9utfT9+yc/rp2TU3BoE99ghhxRWT7+1vbE18ODMuth58cPqrF6dN67+tcYvSxIkhrLrqzGXcd18IRxwxWNmdWlV/demii7531ptvhjBlSrK3z/Tb47i43HHHmd2jZ78BKrYjGsYHuJv7Et/y1MsD2e36lEWbW9UV/x622KK37WrR7uGHQ/j61wdf+De26bnn2geS224LYcMN+50BriNAoGwCAkDZRlR/CFRAoP5Glfi2lI98pHUgePzx6RBx4RPvNg+y4K8AqS4OKBADTbyT325OxvkYg/Ldd2f3Pv56MI3Pzsw55/QOxbARQ29a388YkMnlBAgUREAAKMhAaAYBAgQIECBAgACBPAQEgDyU1UGAAAECBAgQIECgIAICQEEGQjMIECBAgAABAgQI5CEgAOShrA4CBAgQIECAAAECBREQAAoyEJpBgAABAgQIECBAIA8BASAPZXUQIECAAAECBAgQKIiAAFCQgdAMAgQIECBAgAABAnkICAB5KKuDAAECBAgQIECAQEEEBICCDIRmECBAgAABAgQIEMhDQADIQ1kdBAgQIECAAAECBAoiIAAUZCA0gwABAgQIECBAgEAeAgJAHsrqIECAAAECBAgQIFAQAQGgIAOhGQQIECBAgAABAgTyEBAA8lBWBwECBAgQIECAAIGCCAgABRkIzSBAgAABAgQIECCQh4AAkIeyOggQIECAAAECBAgUREAAKMhAaAYBAgQIECBAgACBPAQEgDyU1UGAAAECBAgQIECgIAICQEEGQjMIECBAgAABAgQI5CEgAOShrA4CBAgQIECAAAECBREQAAoyEJpBgAABAgQIECBAIA8BASAPZXUQIECAAAECBAgQKIiAAFCQgdAMAgQIECBAgAABAnkICAB5KKuDAAECBAgQIECAQEEEBICCDIRmECBAgAABAgQIEMhDQADIQ1kdBAgQIECAAAECBAoiIAAUZCA0gwABAgQIECBAgEAeAgJAHsrqIECAAAECBAgQIFAQAQGgIAOhGQQIECBAgAABAgTyEBAA8lBWBwECBAgQIECAAIGCCAgABRkIzSBAgAABAgQIECCQh4AAkIeyOggQIECAAAECBAgUREAAKMhAaAYBAgQIECBAgACBPAQEgDyU1UGAAAECBAgQIECgIAICQEEGQjMIECBAgAABAgQI5CEgAOShrA4CBAgQIECAAAECBREQAAoyEJpBgAABAgQIECBAIA8BASAPZXUQIECAAAECBAgQKIiAAFCQgdAMAgQIECBAgAABAnkIzPLu3448KlIHAQIECBAgQIAAAQLDFxAAhj8GWkCAAAECBAgQIEAgNwEBIDdqFREgQIAAAQIECBAYvoAAMPwx0AICBAgQIECAAAECuQkIALlRq4gAAQIECBAgQIDA8AUEgOGPgRYQIECAAAECBAgQyE1AAMiNWkUECBAgQIAAAQIEhi8gAAx/DLSAAAECBAgQIECAQG4CAkBu1CoiQIAAAQIECBAgMHwBAWD4Y6AFBAgQIECAAAECBHITEAByo1YRAQIECBAgQIAAgeELCADDHwMtIECAAAECBAgQIJCbgACQG7WKCBAgQIAAAQIECAxfQAAY/hhoAQECBAgQIECAAIHcBASA3KhVRIAAAQIECBAgQGD4AgLA8MdACwgQIECAAAECBAjkJiAA5EatIgIECBAgQIAAAQLDFxAAhj8GWkCAAAECBAgQIEAgNwEBIDdqFREgQIAAAQIECBAYvoAAMPwx0AICBAgQIECAAAECuQkIALlRq4gAAQIECBAgQIDA8AUEgOGPgRYQIECAAAECBAgQyE1AAMiNWkUECBAgQIAAAQIEhi8gAAx/DLSAAAECBAgQIECAQG4CAkBu1CoiQIAAAQIECBAgMHwBAWD4Y6AFBAgQIECAAAECBHITEAByo1YRAQIECBAgQIAAgeELCADDHwMtIECAAAECBAgQIJCbgACQG7WKCBAg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gAABAgQIlEBAACjBIOoCAQIECBAgQIAAgaQCAkBSKecRIECAAAECBAgQKIGAAFCCQdQFAgQIECBAgAABAkkFBICkUs4jQIAAAQIECBAgUAIBAaAEg6gLBAgQIECAAAECBJIKCABJpZxHgAABAgQIECBAoAQCAkAJBlEXCBAgQIAAAQIECCQVEACSSjmPAAECBAgQIECAQAkEBIASDKIuECBAgAABAgQIEEgqIAAklXIeAQIECBAgQIAAgRIICAAlGERdIECAAAECBAgQIJBUQABIKuU8AgQIECBAgAABAiUQEABKMIi6QIAAAQIECBAgQCCpgACQVMp5BAgQIECAAAECBEogIACUYBB1gQABAgQIECBAgEBSAQEgqZTzCBAgQIAAAQIECJRAQAAowSDqAgECBAgQIECAAIGkAgJAUinnESBAgAABAgQIECiBgABQgkHUBQIECBAgQIAAAQJJBQSApFLOI0CAAAECBAgQIFACAQGgBIOoCwQIECBAgAABAgSSCggASaWcR4AAAQIECBAgQKAEAgJACQZRFwgQIECAAAECBAgkFRAAkko5jwABAgQIECBAgEAJBASAEgyiLhAgQIAAAQIECBBIKiAAJJVyHgECBAgQIECAAIESCAgAJRhEXSBAgAABAgQIECCQVEAASCrlPAIECBAgQIAAAQIlEBAASjCIukCAAAECBAgQIEAgqYAAkFTKeQQIECBAgAABAgRKICAAlGAQdYEAAQIECBAgQIBAUgEBIKmU8wgQIECAAAECBAiUQEAAKMEg6gIBAgQIECBAgACBpAICQFIp5xEgQIAAAQIECBAogYAAUIJB1AUCBAgQIECAAAECSQUEgKRSziNAgAABAgQIECBQAgEBoASDqAsECBAgQIAAAQIEkgoIAEmlnEeAAAECBAgQIECgBAICQAkGURcIECBAgAABAgQIJBUQAJJKOY8AAQIECBAgQIBACQQEgBIMoi4QIECAAAECBAgQSCogACSVch4BAgQIECBAgACBEggIACUYRF0gQIAAAQIECBAgkFRAAEgq5TwCBAgQIECAAAECJRAQAEowiLpAgAABAgQIECBAIKmAAJBUynkECBAgQIAAAQIESiAgAJRgEHWBAAECBAgQIECAQFIBASCplPMIECBAgAABAgQIlEBAACjBIOoCAQIECBAgQIAAgaQCAkBSKecRIECAAAECBAgQKIGAAFCCQdQFAgQIECBAgAABAkkFBICkUs4jQIAAAQIECBAgUAIBAaAEg6gLBAgQIECAAAECBJIKCABJpZxHgAABAgQIECBAoAQCAkAJBlEXCBAgQIAAAQIECCQVEACSSjmPAAECBAgQIECAQAkEBIASDKIuECBAgAABAgQIEEgqIAAklXIeAQIECBAgQIAAgRIICAAlGERdIECAAAECBAgQIJBUQABIKuU8AgQIECBAgAABAiUQEABKMIi6QIAAAQIECBAgQCCpgACQVMp5BAgQIECAAAECBEogIACUYBB1gQABAgQIECBAgEBSAQEgqZTzCBAgQIAAAQIECJRAQAAowSDqAgECBAgQIECAAIGkAgJAUinnESBAgAABAgQIECiBgABQgkHUBQIECBAgQIAAAQJJBQSApFLOI0CAAAECBAgQIFACAQGgBIOoCwQIECBAgAABAgSSCggASaWcR4AAAQIECBAgQKAEAgJACQZRFwgQIECAAAECBAgkFRAAkko5jwABAgQIECBAgEAJBASAEgyiLhAgQIAAAQIECBBIKiAAJJVyHgECBAgQIECAAIESCAgAJRhEXSBAgAABAgQIECCQVEAASCrlPAIECBAgQIAAAQIlEBAASjCIukCAAAECBAgQIEAgqYAAkFTKeQQIECBAgAABAgRKICAAlGAQdYEAAQIECBAgQIBAUgEBIKmU8wgQKKzAE088Ee6///7w0ksvhRdffDEssMAC4aMf/WhYbrnlwiqrrFLYdo9qw5q933nnnVpXFlxwQe6jOqjaTYBApQQEgEoNt84SKJfAOeecE/7zP/8zPPbYY207Nu+884YvfOEL4fjjjw/zzDNPuQBy7k0S73qTFllkkbDtttuG8ePHc895nFRHgACBbgICQDch/5wAgcIJ3HLLLeHoo48O8U500mO22WYLG2ywQfj2t78d5ptvvqSXOe9vAv141+Gi9eGHHx7GjRvHkgABAgQKIiAAFGQgNIMAgWQC5513XjjssMOSndzirLnnnjucddZZtV8FHN0FBvWu17DPPvuE4447rnuFziBAgACBzAUEgMyJVUCAQFoC3/3ud8NBBx2USnFf+tKXwn/8x3+kUlZZC0nTOxoJAWWdKfpFgMCoCQgAozZi2kugogJ33nln2HrrrVPt/Ve/+tVw6KGHplpmWQrLwjvaTJo0yXagskwS/SBAYGQFBICRHToNJ1Atgc022yz87Gc/S73T8ZmA7bffPvVyR73ArLzjMwEPP/ywB4NHfYJoPwECIy0gAIz08Gk8gWoIXHnllWGvvfbKpLNzzTVX7WHiOeecM5PyR7HQLL2jR3wz0JFHHjmKNNpMgACBUggIAKUYRp0gUG6BnXbaKdxwww2ZdXLixIlh7733zqz8USs4a+/4itCpU6eOGov2EiBAoDQCAkBphlJHCJRT4M9//nOIC8b6x6ay6OUSSywR7rvvviyKHrkyo/fYsWPD22+/nWnbb7zxRh9py1RY4QQIEGgvIACYHQQIFFrgmGOOCWeccUbmbbz99tvDCiuskHk9Ra/gF7/4Rdhoo40yb+ZJJ50Udt9998zrUQEBAgQIvF9AADArCBAotEDW21HqnT///PPDVlttVWiLPBp3/fXXh5133jnzqiZMmBC+9rWvZV6PCggQIEBAADAHCBAYMYELLrggl1d1HnHEEeHAAw8cMZ30m3vppZfWHtLN+thtt93CySefnHU1yidAgACBFgJ+ATAtCBAotMApp5wSTjjhhMzbuMsuu4RTTz0183qKXsHNN98cdtxxx8ybGb/mfMghh2RejwoIECBAwC8A5gABAiMm8P3vfz+XN/TE/ehxX3rVj0ceeSSsv/76mTOcdtppuWw1yrwjKiBAgMAICvgFYAQHTZMJVEngl7/8ZVh77bUz73K8+x9/BXCEEN+K9Lvf/S5TivhRt6WWWirTOhROgAABAq0FBAAzgwCBwgssvPDC4U9/+lOm7bz11lvDSiutlGkdo1L4PvvsEyZPnpxZc5dddtkwZcqUzMpXMAECBAh0FhAAzBACBAovED/SFbcCZXm8+OKLYfbZZ8+yipEp+6677gpbbrllZu2Nz3TsueeemZWvYAIECBAQAMwBAgRGXOD+++8Pm266aWa9WG655cJPfvKTzMofxYLHjRsXrr322tSbHrf9xO0/DgIECBAYnoBfAIZnr2YCBHoQiPvzf/SjH/VwRfJTJ02aFOKC1/GewDPPPFMLXS+//HKqLFdccUUuHxpLtdEKI0CAQMkEBICSDajuECirwEsvvRTWWWed8Morr6TaxSWXXDLce++9qZZZlsLuuOOOsO2226bWnRNPPDHsscceqZWnIAIECBDoT0AA6M/NVQQIDEHgxhtvrL068p133kmt9viw64YbbphaeWUrKIaA+AzGoL8EeMtS2WaG/hAgMMoCAsAoj562E6igQNyrHz9U9dZbbw3cew+jJiOM24EmTpzY1zMBa6yxRpgwYUJYd911k1XmLAIECBDIXEAAyJxYBQQIpC3wwgsvhH333TfEt9X0e7gj3btc9L788stD/Fpwp+8EzDbbbGHjjTcOW2yxRdhuu+16r8gVBAgQIJCpgACQKa/CCRDIUuCaa64J8S7+//zP/ySuZs011wwHHXRQWG+99RJf48T3C8QvBsdXp8ZnM+pbsj784Q+Hj370oyG+53+OOebARoAAAQIFFRAACjowmkWAQHKB+FrJb37zm+HBBx8Mr7/++vsujHekP/vZz4bNN9/cHenkrM4kQIAAgZIKCAAlHVjdIlBVgRgCXn311fDaa6+FueeeO8SvCH/qU58Kc845Z1VJ9JsAAQIECMwkIACYEAQIECBAgAABAgQqJCAAVGiwdZUAAQIECBAgQICAAGAOECBAgAABAgQIEKiQgABQocHWVQIECBAgQIAAAQICgDlAgAABAgQIECBAoEICAkCFBltXCRAgQIAAAQIECAgA5gABAgQIECBAgACBCgkIABUabF0lQIBAGQSeeOKJcP/999e+Qhy/RrzAAgvUvkC83HLLhVVWWaUMXdQHAgQIZCogAGTKq3ACBAgQSEvguOOOC1dccUVt0d/uGDt2bNhmm23CgQceWPsQnIMAAQIE3i8gAJgVBAgQIFBYgbfffjsceeSR4ZJLLglvvvlm4nbON9984fDDDw/jxo1LfI0TCRAgUBUBAaAqI62fBAgQGDGBhx56KOy8887ht7/9bd8t32effUL85cBBgAABAu8JCABmAwECBAgUTuCiiy4KEyZMSKVde++9d5g4cWIqZSmEAAECZRAQAMowivpAgACBEgkccsgh4cILL0y1R5MmTbIdKFVRhREgMMoCAsAoj562EyBAoGQCccvO5MmTU+9VfCbg4YcfDvPMM0/qZSuQAAECoyYgAIzaiGkvAQIESirwb//2b+HHP/5xZr0bP3587YFiBwECBKouIABUfQboPwECBAogsMcee4Srr74605YsssgiYerUqZnWoXACBAiMgoAAMAqjpI0ECirwyCOPhCeffDI899xz4fnnnw/vvPNOraXxo0wLL7xwWHzxxcOaa65Z0NZrVlEETjvttNze1HPjjTf6WFhRBl47CBAYmoAAMDR6FRMYXYEzzjgjXHPNNYnupi6xxBJhq622CvEO75gxY0a301qeicBtt90Wtt9++0zKblXoSSedFHbffffc6lMRAQIEiiggABRxVLSJQEEFbrrppnD88ceHxx57rOcWLrDAAuGoo46qvdfdQSAKvPbaa2HdddcNv/nNb3IDOfjgg2sfCHMQIECgygICQJVHX98J9CBw/fXXp7J492GmHtBLfuqWW24Z7rrrrlx7ucsuu4RTTz011zpVRoAAgaIJCABFGxHtIVBAgXvuuae2jecvf/lLKq2LWzDiVgxHdQV22GGHcOutt+YOsNtuu4WTTz4593pVSIAAgSIJCABFGg1tIVBAgSeeeCJsscUW4eWXX061dWeeeWbYcccdUy1TYcUXeOqpp0L8Mu8vfvGLoTT2sMMOC/FDYw4CBAhUWUAAqPLo6zuBBAIbbrhheOihhxKc2dsps88+e+1ZAg8G9+Y2ymfn+bafdk6xDZ5DGeVZpO0ECKQhIACkoagMAiUViB9lih9nyupYaaWVhrINJKv+KLe1wAUXXFDb8pX2r0j9eP/sZz8LSy21VD+XuoYAAQKlERAASjOUOkIgfYFtt9023HHHHekX3FDieeedF7beeutM61B4/gJvv/12uOKKK8Ipp5wSpk2bln8DWtS47LLLhilTphSiLRpBgACBYQoIAMPUVzeBAgvEj3rFj3m99dZbmbYybgG67777wvzzz59pPQrPTyBuGYvffXjmmWfyqzRBTSeccELYc889E5zpFAIECJRbQAAo9/jqHYG+Be6+++7aw795HPFrweeee27tC8KO0RaI++vjK2OLdnzyk58M8W1WDgIECBAIQQAwCwgQaCmQ1nv/k/LOOuus4cQTTwzjxo1LeonzCiRw0UUXhWOPPTa8/vrrBWrVe025/PLLw8Ybb1zItmkUAQIE8hYQAPIWVx+BERGYPHlyiB/tyvvwobC8xQer75xzzgnxId+nn356sIIyvDoGy7glyUGAAAEC0wUEADOBAIGWAjfccEPYaaedhqJzwAEHhKOOOmoodas0mcA111wTJk6cGJ599tlkFwzprP322y98/etfH1LtqiVAgEAxBQSAYo6LVhEYukD8ANgaa6wxtHbEO8vxLUSO4gnEBfXpp59evIY1tSje9Y93/x0ECBAgMLOA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y7zTf8TGTHMJECAgAJgDBAgURuDll18O48eP94xAYUakc0NiaIsffXMQIECAwGgJCACjNV5aS6ASAldddVX4xje+EZ599tlK9HcUO3nggQeGI444YhSbrs0ECBCovIAAUPkpAIBAcQUmTJgQLrroouI2sKIt+/jHPx4efPDBivZetwkQIDD6AgLA6I+hHhAotcDtt98evvKVr4Tf/va3pe7nqHTu8MMPDwcffPCoNFc7CRAgQKCFgABgWhAgUHiB+PGwww47rPbqUMfwBI4++uhaGHMQIECAwGgLCACjPX5aT6BSAlOmTAnf+973wjXXXOP7ATmO/Cc+8Ynw7W9/O6y88so51qoqAgQIEMhKQADISla5BAhkJvCnP/0pPPXUU2HatGnhmWeeqX2B9oYbbvAtgZTFP/CBD4TddtstnHjiiSmXrDgCBAgQGKaAADBMfXUTIJCqQPzCcHwv/a233ioMDCi76qqrhosvvjh85CMfGbAklxMgQIBA0QQEgKKNiPYQIJCKwNSpU8OVV15Z27ri6E1g2223Deecc05vFzmbAAECBEZGQAAYmaHSUAIE+hG47bbbam+tee655/q5vFLXzD777OHss88OW2+9daX6rbMECBComoAAULUR118CFRR49dVXayHguuuuq2Dvk3U5bvmZOHFi+PSnP53sAmcRIECAwMgKCAAjO3QaToBArwLxGYELLrgg/PCHP+z10lKeP+uss4bNN9887LrrrmHttdcuZR91igABAgTeLyAAmBUECFRO4I9//GN48skna/+JbxOK/3n55ZdrD7zG//7LX/4yLLDAAuF///d/S2Uz77zzhrjo//znPx/Gjx8fFl988TDLLLOUqo86Q4AAAQLdBQSA7kbOIECgogLxNaPxjUI33XRTiN8g+Mtf/pK7xMILLxxWX3312h36F154IcR38v/1r38Nb731Vnj33Xdbtuf111+v/fM555wzjBkzJowdOzb84z/+Y/jQhz6Ue/tVSIAAAQLFExAAijcmWkSAQAEF3n777fDoo4/WvjsQnymIR3xoNq3j//7v/2oBY4455qj9+rDooouGpZdeOsw///xpVaEcAgQIECBQExAATAQCBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUEBIAKDbauEiBAgAABAgQIEBAAzAECBAgQIECAAAECFRIQACo02LpKgAABAgQIECBAQAAwBwgQIECAAAECBAhUSEAAqNBg6yoBAgQIECBAgAABAcAcIECAAAECBAgQIFAhAQGgQoOtqwQIECBAgAABAgQEAHOAAAECBAgQIECAQIUE/h9bp/il0muJ0gAAAABJRU5ErkJggg==',
        }
    })

    await prisma.kudo.create({
        data: {
            image: imageid.id,
            sessionId: "14",
            userId: "cdb23f58-65db-4b6b-b132-cf2d13d08e76",
            anonymous: false,
        }
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })