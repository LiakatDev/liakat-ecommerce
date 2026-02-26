import Image from "next/image"

const ContentfulImage = ({
  altText,
  image,
  target,
}: {
  altText: string
  image: { url: string; width: number; height: number }
  target: {
    label: string
    destination: string
  }
}) => {
  return (
    <Image
      src={`${image.url}?w=1600`}
      width={image.width}
      height={image.height}
      alt={altText}
    />
  )
}

export default ContentfulImage
