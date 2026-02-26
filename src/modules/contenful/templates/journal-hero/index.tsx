import Image from "next/image"

export async function JournalHero({
  title,
  excerpt,
  image,
}: {
  title: string
  excerpt: string
  image: { url: string; width: number; height: number }
}) {
  return (
    <main className="content-container md:min-h-132 py-4 flex flex-col md:flex-row md:justify-between md:align-bottom">
      <div className="w-full md:w-1/2 mb-8 md:m-0">
        <h1 className="page-title w-full max-w-lg">{title}</h1>
        <p className="flatlist-mini-text max-w-xs float-right mt-8">
          {excerpt}
        </p>
      </div>
      <div className="w-full md:w-1/2 flex md:justify-end md:items-end">
        <Image
          src={image.url}
          alt={title}
          width={image.width}
          height={image.height}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </main>
  )
}

export default JournalHero
