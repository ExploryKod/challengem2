import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales - Papilles des Suds",
  description: "Mentions légales du site Papilles des Suds",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-amber-200 to-yellow-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
        <Link 
          href="/" 
          className="inline-block mb-6 text-[#458236] hover:text-[#3a6b2d] font-medium transition duration-150"
        >
          ← Retour
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Mentions Légales
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Éditeur du Site</h2>
          <p className="text-gray-700 mb-4">
            Le site Papilles des Suds est édité dans le cadre d&apos;un projet éducatif et de démonstration 
            par l&apos;équipe de développement du projet.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Important : Papilles des Suds est un site de démonstration à des fins éducatives.</strong> Ce Site est destiné 
            uniquement à des fins de démonstration et d&apos;apprentissage. Les utilisateurs ne doivent pas utiliser leurs 
            vraies données personnelles (notamment leur adresse email réelle) lors de l&apos;utilisation 
            du service.
          </p>
          <p className="text-gray-700">
            <strong>Contact :</strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Directeur de la Publication</h2>
          <p className="text-gray-700 mb-4">
            Le directeur de la publication est l&apos;équipe de développement du projet Papilles des Suds.
          </p>
          <p className="text-gray-700">
            <strong>Contact :</strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Hébergeur</h2>
          <p className="text-gray-700 mb-4">
            <strong>Hébergement du Site :</strong><br />
            Le Site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
          <p className="text-gray-700 mb-4">
            Pour plus d&apos;informations sur la conformité de Vercel aux normes de sécurité et de confidentialité des données, 
            consultez : <a href="https://vercel.com/docs/security/compliance" target="_blank" rel="noopener noreferrer" className="text-[#458236] hover:underline">https://vercel.com/docs/security/compliance</a>
          </p>
          <p className="text-gray-700 mb-4">
            Pour consulter la politique de protection des données de Vercel, 
            consultez : <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#458236] hover:underline">https://vercel.com/legal/privacy-policy</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contact</h2>
          <p className="text-gray-700 mb-4">
            Pour toute question, réclamation ou signalement concernant le Site Papilles des Suds, vous pouvez nous contacter 
            à l&apos;adresse email suivante :
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Email :</strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a>
          </p>
          <p className="text-gray-700">
            Nous nous engageons à répondre à vos demandes dans les meilleurs délais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Propriété Intellectuelle</h2>
          <p className="text-gray-700">
            L&apos;ensemble des contenus présents sur le site Papilles des Suds (textes, images, logos, graphismes, etc.) 
            sont la propriété de l&apos;éditeur du site ou de ses partenaires et sont protégés par les lois françaises et 
            internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication, 
            adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
            sauf autorisation écrite préalable de l&apos;éditeur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Responsabilité</h2>
          <p className="text-gray-700 mb-4">
            L&apos;éditeur du site s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées 
            sur le site, dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, 
            l&apos;éditeur ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises 
            à disposition sur le site.
          </p>
          <p className="text-gray-700">
            En conséquence, l&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive. Le site 
            peut contenir des liens hypertextes vers d&apos;autres sites présents sur le réseau Internet. Les liens vers ces 
            autres ressources vous font quitter le site Papilles des Suds. Il est possible de créer un lien vers la page de 
            présentation de ce site sans autorisation expresse de l&apos;éditeur. Aucune autorisation ni demande d&apos;information 
            préalable ne peut être exigée par l&apos;éditeur à l&apos;égard d&apos;un site qui souhaite établir un lien vers le 
            site de l&apos;éditeur. Il convient toutefois d&apos;afficher ce site dans une nouvelle fenêtre du navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Signalement de Contenus Illicites</h2>
          <p className="text-gray-700 mb-4">
            Conformément à la législation en vigueur, tout utilisateur peut signaler un contenu illicite ou portant 
            atteinte aux droits des tiers présents sur le Site Papilles des Suds.
          </p>
          <p className="text-gray-700 mb-4">
            Pour signaler un tel contenu, vous pouvez nous contacter à l&apos;adresse email suivante : 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
          <p className="text-gray-700 mb-4">
            Votre signalement doit contenir les informations suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Vos coordonnées (nom, prénom, adresse email)</li>
            <li>La description précise du contenu signalé</li>
            <li>L&apos;URL ou l&apos;emplacement du contenu sur le Site</li>
            <li>Les motifs du signalement (contenu illicite, atteinte aux droits, etc.)</li>
          </ul>
          <p className="text-gray-700">
            Nous nous engageons à examiner votre signalement dans les meilleurs délais et à prendre les mesures 
            appropriées conformément à la réglementation en vigueur.
          </p>
        </section>

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Ces mentions légales sont fournies à titre informatif pour le site de démonstration Papilles des Suds. 
            Pour toute question, veuillez nous contacter à l&apos;adresse 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
        </footer>
      </div>
    </main>
  );
}

