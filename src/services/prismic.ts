import Prismic from '@prismicio/client'

// doc prismic informa sempre instanciar o client qndo for abrir uma conexão
export function getPrismicClient(req?: unknown) {
    const prismic = Prismic.client(
        process.env.PRISMIC_END_POINT,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )

    return prismic;
}