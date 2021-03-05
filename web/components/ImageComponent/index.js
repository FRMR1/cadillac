import Image from "next/image"

const ImageComponent = ({
    src,
    alt = "Cadillac",
    width,
    height,
    loading = "lazy",
}) => {
    const hostUrl = `https://res.cloudinary.com/dlvyo01vn/image/upload/cadillac`

    return (
        <Image
            className="object-center object-cover w-full h-full"
            src={`${hostUrl}/${src}`}
            alt={alt}
            width={width}
            height={height}
            quality={10}
            loading={loading}
        />
    )
}

export default ImageComponent
