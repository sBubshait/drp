export default function PinkContainer({ text }) {
    return (
        <div
            className="rounded-xl p-5 mb-3 mt-5 text-white text-center text-xl font-semibold"
            style={{ backgroundColor: '#F08FB3' }}
        >
            {text}
        </div>
    )
}
