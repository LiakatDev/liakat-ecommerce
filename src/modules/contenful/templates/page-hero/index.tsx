import Image from "next/image"

export async function PageHero({
  title,
  excerpt,
  image,
}: {
  title: string
  excerpt: string
  image?: { url: string; width: number; height: number }
}) {
  return (
    <main className="content-container py-4 px-6 flex flex-col md:flex-row md:justify-between md:align-bottom">
      <div className="w-full md:w-1/3 mb-8">
        <h1 className="flatlist-h1 w-full max-w-lg">{title}</h1>
        {excerpt && (
          <p className="flatlist-mini-text max-w-xs float-right mt-8">
            {excerpt}
          </p>
        )}
      </div>
      <div className="w-full md:w-2/3 flex md:justify-end md:items-end">
        {image && (
          <Image
            src={image.url}
            alt={title}
            width={image.width}
            height={image.height}
            style={{ objectFit: "contain" }}
            priority
          />
        )}
      </div>
    </main>
  )
}

export default PageHero
