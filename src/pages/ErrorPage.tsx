export function ErrorPage() {
    return (
        <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative" >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
        <h1 className="text-2xl font-semibold text-gray-800">Página indisponível no momento</h1>
        <p className="text-gray-500 text-sm mt-2">
            Não foi possível carregar a página. A página pode estar fora do ar por um tempo. Por favor, tente novamente mais tarde.
        </p>
                </div>
            </div>
        </div>
        
    );
}