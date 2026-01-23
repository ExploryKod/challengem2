import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - Taste Federation",
  description: "Conditions générales d'utilisation du site Taste Federation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConditionsGenerales() {
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
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Objet</h2>
          <p className="text-gray-700 mb-4">
            Les présentes Conditions Générales d&apos;Utilisation (ci-après les « <strong>CGU</strong> ») ont pour objet 
            de définir les conditions d&apos;accès et d&apos;utilisation du site web Taste Federation (le « <strong>Site</strong> »), 
            accessible à l&apos;adresse <strong>https://taste-federation.vercel.app</strong>.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Important : Taste Federation est un site de démonstration à des fins éducatives.</strong> Ce Site est destiné 
            uniquement à des fins de démonstration et d&apos;apprentissage. Les utilisateurs ne doivent pas utiliser leurs 
            vraies données personnelles (notamment leur adresse email réelle) lors de l&apos;utilisation 
            du service.
          </p>
          <p className="text-gray-700">
            Le Site propose un service de réservation de tables de restaurant permettant aux utilisateurs de réserver 
            une table dans un restaurant sélectionné, en choisissant la date, l&apos;heure, le nombre de convives et les plats.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Acceptation des CGU</h2>
          <p className="text-gray-700 mb-4">
            L&apos;accès et l&apos;utilisation du Site impliquent l&apos;acceptation pleine et entière des présentes CGU. 
            En naviguant sur le Site, en effectuant une réservation ou en utilisant les services proposés, l&apos;utilisateur reconnaît 
            avoir pris connaissance des présentes conditions et s&apos;engage à les respecter.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Avertissement :</strong> En utilisant le Site, l&apos;utilisateur reconnaît 
            que Taste Federation est un site de démonstration et qu&apos;il ne doit pas utiliser ses 
            vraies données personnelles. L&apos;utilisateur doit utiliser uniquement des données fictives.
          </p>
          <p className="text-gray-700">
            Si l&apos;utilisateur n&apos;accepte pas les présentes CGU, il ne doit pas utiliser le Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Utilisation du Service et Réservation</h2>
          <p className="text-gray-700 mb-4">
            Pour utiliser le service de réservation, l&apos;utilisateur doit fournir les informations suivantes : 
            nom, prénom, adresse email, numéro de téléphone, date et heure souhaitées, nombre de convives, restaurant sélectionné, et choix de plats.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Interdiction formelle d&apos;utiliser des données personnelles réelles :</strong>
          </p>
          <p className="text-gray-700 mb-4">
            Conformément au caractère démonstratif du Site, <strong>l&apos;utilisation de données personnelles réelles est 
            strictement interdite</strong>. L&apos;utilisateur s&apos;engage formellement à ne pas utiliser :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Son adresse email réelle</li>
            <li>Son nom réel ou prénom réel</li>
            <li>Son numéro de téléphone réel</li>
            <li>Toute autre donnée personnelle réelle permettant de l&apos;identifier</li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Exception :</strong> Cette interdiction ne s&apos;applique pas aux données techniques sur lesquelles 
            l&apos;utilisateur n&apos;a pas de contrôle direct, telles que l&apos;adresse IP, qui sont collectées automatiquement 
            par le système lors de la navigation sur le Site.
          </p>
          <p className="text-gray-700 mb-4">
            Étant donné que Taste Federation est un site de démonstration, l&apos;utilisateur 
            doit utiliser uniquement des données fictives.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Engagements de l&apos;utilisateur :</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Ne pas utiliser ses vraies données personnelles (nom réel, adresse email réelle, numéro de téléphone réel, etc.)</li>
            <li>Utiliser uniquement des données fictives ou pseudonymes</li>
            <li>Comprendre que les réservations effectuées sur ce site sont fictives et ne donneront lieu à aucune réservation réelle</li>
            <li>Ne pas considérer ce site comme un service de réservation réel</li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Conséquences du non-respect :</strong> En cas de non-respect de cette interdiction, l&apos;utilisateur 
            s&apos;expose à la suppression immédiate de ses données et à l&apos;interdiction d&apos;accès au Site. L&apos;utilisateur 
            est seul responsable de l&apos;utilisation du Site et des actions effectuées à partir de celui-ci.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Nature démonstrative des réservations :</strong> Toutes les réservations effectuées sur le Site sont 
            fictives et à des fins de démonstration uniquement. Aucune réservation réelle ne sera effectuée dans un restaurant. 
            L&apos;utilisateur ne doit pas s&apos;attendre à recevoir une confirmation de réservation réelle ou à pouvoir 
            utiliser les réservations effectuées sur ce site dans un restaurant réel.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Comportement des Utilisateurs</h2>
          <p className="text-gray-700 mb-4">
            L&apos;utilisateur s&apos;engage à utiliser le Site de manière conforme à sa destination et à respecter les 
            présentes CGU. Les comportements suivants sont strictement interdits :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Utilisation de données personnelles réelles :</strong> L&apos;utilisation de vraies données 
              personnelles (adresse email réelle, nom réel, prénom réel, numéro de téléphone réel, etc.) est formellement interdite. Seules 
              des données fictives ou pseudonymes sont autorisées.
            </li>
            <li>
              <strong>Contenus illicites :</strong> La publication, la transmission ou le partage de contenus illicites, 
              diffamatoires, injurieux, racistes, sexistes, homophobes ou portant atteinte à la dignité humaine est 
              strictement interdite.
            </li>
            <li>
              <strong>Spam et harcèlement :</strong> L&apos;envoi de messages non sollicités, le spam, le harcèlement 
              ou l&apos;intimidation d&apos;autres utilisateurs est interdit.
            </li>
            <li>
              <strong>Atteinte aux droits de tiers :</strong> Toute atteinte aux droits de propriété intellectuelle, 
              au droit à l&apos;image, au droit à la vie privée ou à tout autre droit de tiers est interdite.
            </li>
            <li>
              <strong>Intrusion dans le système :</strong> Toute tentative d&apos;intrusion, de piratage, de contournement 
              des mesures de sécurité ou d&apos;altération du fonctionnement du Site est strictement interdite.
            </li>
            <li>
              <strong>Usurpation d&apos;identité :</strong> L&apos;usurpation de l&apos;identité d&apos;une autre personne 
              ou d&apos;une entité est interdite.
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Sanctions :</strong> En cas de non-respect de ces règles, l&apos;utilisateur s&apos;expose à :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>La suppression immédiate de ses données</li>
            <li>L&apos;interdiction d&apos;accès au Site</li>
            <li>Des poursuites judiciaires si les faits le justifient</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Propriété Intellectuelle</h2>
          <p className="text-gray-700 mb-4">
            L&apos;ensemble des contenus présents sur le site Taste Federation (textes, images, logos, graphismes, etc.) 
            sont la propriété de l&apos;éditeur du site ou de ses partenaires et sont protégés par les lois françaises et 
            internationales relatives à la propriété intellectuelle.
          </p>
          <p className="text-gray-700">
            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, 
            quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l&apos;éditeur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Responsabilités</h2>
          <p className="text-gray-700 mb-4">
            L&apos;éditeur du site s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées 
            sur le site, dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, 
            l&apos;éditeur ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises 
            à disposition sur le site.
          </p>
          <p className="text-gray-700 mb-4">
            En conséquence, l&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive. Le site 
            peut contenir des liens hypertextes vers d&apos;autres sites présents sur le réseau Internet. Les liens vers ces 
            autres ressources vous font quitter le site Taste Federation.
          </p>
          <p className="text-gray-700">
            <strong>Limitation de responsabilité :</strong> Étant donné que Taste Federation est un site de démonstration, 
            l&apos;éditeur ne peut être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation 
            du Site ou de l&apos;impossibilité de l&apos;utiliser. Les réservations effectuées sur ce site sont fictives et 
            ne donnent lieu à aucune obligation réelle de la part de l&apos;éditeur ou des restaurants mentionnés.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Données Personnelles</h2>
          <p className="text-gray-700 mb-4">
            Le traitement des données personnelles collectées sur le Site est détaillé dans notre 
            <Link href="/politique-de-confidentialite" className="text-[#458236] hover:underline"> Politique de Protection des Données</Link>, que l&apos;utilisateur 
            est invité à consulter.
          </p>
          <p className="text-gray-700">
            <strong>Important :</strong> Étant donné que Taste Federation est un site de démonstration, l&apos;utilisateur est 
            expressément invité à ne pas utiliser ses vraies données personnelles. En outre, compte tenu du caractère 
            démonstratif du Site, toutes les données associées peuvent être supprimées à tout moment 
            sans préavis. L&apos;utilisateur ne doit donc pas considérer le Site comme un service permanent pour le stockage 
            de ses données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Durée et Résiliation</h2>
          <p className="text-gray-700 mb-4">
            Les présentes CGU s&apos;appliquent pendant toute la durée d&apos;utilisation du Site par l&apos;utilisateur.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Résiliation par l&apos;utilisateur :</strong> L&apos;utilisateur peut à tout moment cesser d&apos;utiliser 
            le Site et demander la suppression de ses données en nous contactant à l&apos;adresse 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Résiliation par l&apos;éditeur :</strong> Étant donné que Taste Federation est un site de démonstration à des fins 
            éducatives, l&apos;éditeur se réserve le droit de supprimer toutes les données utilisateur à tout moment, sans préavis et 
            sans notification préalable. Cette suppression peut intervenir notamment pour :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Des raisons techniques ou de maintenance</li>
            <li>Des raisons de sécurité</li>
            <li>Le non-respect des présentes CGU</li>
            <li>La nécessité de libérer de l&apos;espace de stockage</li>
            <li>Toute autre raison liée au caractère démonstratif du Site</li>
          </ul>
          <p className="text-gray-700">
            <strong>Conséquences de la résiliation :</strong> En cas de suppression des données, toutes les informations associées 
            (réservations, préférences, historique) peuvent être définitivement supprimées sans possibilité de récupération. 
            L&apos;utilisateur reconnaît et accepte que, compte tenu du caractère démonstratif du Site, aucune garantie n&apos;est 
            donnée quant à la conservation de ses données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Modifications des CGU</h2>
          <p className="text-gray-700 mb-4">
            Nous nous réservons le droit de modifier les présentes CGU à tout moment pour les adapter aux évolutions 
            du Site, de la législation ou de nos pratiques.
          </p>
          <p className="text-gray-700 mb-4">
            En cas de modifications majeures apportées aux présentes CGU, nous afficherons une notification de manière 
            visible sur la page d&apos;accueil du Site. Nous vous invitons à consulter 
            régulièrement les présentes CGU pour prendre connaissance des éventuelles modifications.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Date de prise d&apos;effet :</strong> Les présentes CGU entrent en vigueur à compter de leur date de 
            dernière mise à jour, indiquée en haut de ce document. En continuant à utiliser le Site après la publication 
            de modifications, l&apos;utilisateur accepte tacitement les nouvelles conditions.
          </p>
          <p className="text-gray-700">
            Si l&apos;utilisateur n&apos;accepte pas les modifications apportées aux présentes CGU, il doit cesser 
            d&apos;utiliser le Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Droit Applicable et Litiges</h2>
          <p className="text-gray-700 mb-4">
            Les présentes Conditions Générales d&apos;Utilisation sont régies par le droit français.
          </p>
          <p className="text-gray-700 mb-4">
            En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes CGU, 
            et à défaut d&apos;accord amiable, le litige sera porté devant les tribunaux compétents 
            conformément aux règles de compétence en vigueur.
          </p>
          <p className="text-gray-700">
            Avant toute action judiciaire, les parties s&apos;engagent à rechercher une solution amiable. 
            À cet effet, vous pouvez nous contacter à l&apos;adresse suivante : 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact</h2>
          <p className="text-gray-700 mb-4">
            Pour toute question relative aux présentes Conditions Générales d&apos;Utilisation, 
            vous pouvez nous contacter à l&apos;adresse email suivante :
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Email :</strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a>
          </p>
          <p className="text-gray-700">
            Nous nous engageons à répondre à vos demandes dans les meilleurs délais.
          </p>
        </section>

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Pour toute question relative aux présentes conditions, veuillez nous contacter à l&apos;adresse 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
        </footer>
      </div>
    </main>
  );
}

