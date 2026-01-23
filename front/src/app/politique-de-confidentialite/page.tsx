import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Taste Federation",
  description: "Politique de protection des données du site Taste Federation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PolitiqueConfidentialite() {
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
            Politique de Protection des Données
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : 23 janvier 2026
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            La présente Politique a pour objectif de vous informer du traitement de vos données personnelles 
            et de l&apos;utilisation de cookies lors de votre navigation sur le site web Taste Federation
            (le « <strong>Site</strong> »), accessible à l&apos;adresse <strong>https://taste-federation.vercel.app</strong>.
          </p>
          <p className="text-gray-700 mb-4">
            Taste Federation est un site de démonstration proposant un service de réservation de tables de restaurant. 
            À travers cette Politique, nous souhaitons que vous compreniez la nature des informations personnelles 
            que nous recueillons, la façon dont nous les utilisons, avec qui nous les partageons, comment nous nous 
            efforçons de les protéger, comment vous pouvez exercer vos droits et, enfin, comment nous contacter.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Important : Taste Federation est un site de démonstration à des fins éducatives.</strong> Ce Site est une démonstration 
            et les utilisateurs ne doivent <strong>pas utiliser leurs vraies données personnelles</strong> (notamment leur adresse email réelle) lors de 
            l&apos;utilisation du service. Les utilisateurs doivent utiliser uniquement des données fictives.
          </p>
          <p className="text-gray-700 mb-4">
            Le présent document a également pour objet de vous communiquer toutes les informations imposées par 
            l&apos;article 32 de la loi Informatique et Libertés et par l&apos;article 13 du Règlement UE 2016/679 
            du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques 
            à l&apos;égard du traitement des données à caractère personnel et à la libre circulation de ces données 
            (« <strong>RGPD</strong> »).
          </p>
          <p className="text-gray-700">
            Nous attirons votre attention sur le fait que nous pouvons être amenés à apporter des modifications 
            à ce présent document notamment pour le conformer à toute nouvelle réglementation ou pour l&apos;adapter 
            à nos pratiques.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 1 – Responsable du traitement</h2>
          <p className="text-gray-700 mb-4">
            Le responsable du traitement des données personnelles collectées sur le Site Taste Federation est l&apos;équipe 
            de développement du projet, dans le cadre d&apos;un projet éducatif et de démonstration.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Hébergement du Site :</strong><br />
            Le Site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
          <p className="text-gray-700 mb-4">
            Pour plus d&apos;informations sur la conformité de Vercel aux normes de sécurité et de confidentialité des données, 
            consultez : <a href="https://vercel.com/docs/security/compliance" target="_blank" rel="noopener noreferrer" className="text-[#458236] hover:underline">https://vercel.com/docs/security/compliance</a>
          </p>
          <p className="text-gray-700">
            Pour consulter la politique de protection des données de Vercel, 
            consultez : <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#458236] hover:underline">https://vercel.com/legal/privacy-policy</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 2 – Collecte de données à caractère personnel</h2>
          <p className="text-gray-700 mb-4">
            La notion de « donnée à caractère personnel » ou « donnée personnelle » désigne toute information 
            relative à une personne physique identifiée ou identifiable.
          </p>
          <p className="text-gray-700 mb-4">
            Conformément au principe de minimisation, nous veillons à ne collecter que des données personnelles 
            strictement nécessaires à la finalité des traitements mis en œuvre.
          </p>
          <p className="text-gray-700 mb-4">
            Lors de votre navigation sur le Site, et en fonction de vos actions, nous sommes susceptibles de 
            collecter des données à caractère personnel vous concernant.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Action 1 : Lorsque vous naviguez sur le Site</h3>
          <p className="text-gray-700 mb-4">
            Les données personnelles collectées sont les suivantes : les données de navigation telles que 
            l&apos;adresse IP et les indications en matière de communication qui sont mises à disposition du fait 
            de l&apos;utilisation de votre ordinateur. Ces données sont collectées (i) soit automatiquement, 
            (ii) soit après avoir recueilli votre consentement.
          </p>
          <p className="text-gray-700 mb-4">
            En outre, des données statistiques peuvent être recueillies lors de votre visite et être utilisées 
            (nombre de pages vues, nombre de visites du site…). Pour plus d&apos;information sur les données 
            statistiques, ou les données collectées dans le cadre de l&apos;utilisation de cookies, rendez-vous 
            sur le bandeau cookie à disposition sur chaque page.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Action 2 : Lorsque vous effectuez une réservation</h3>
          <p className="text-gray-700 mb-4">
            Le Site vous permet d&apos;effectuer une réservation de table dans un restaurant. 
            Pour effectuer votre réservation, vous renseignez les informations suivantes : données d&apos;identification 
            (<em>nom, prénom</em>), données de contact (<em>adresse email, numéro de téléphone</em>), données relatives à la réservation 
            (<em>date, heure, nombre de convives, restaurant sélectionné</em>).
          </p>
          <p className="text-gray-700 mb-4">
            Certaines données collectées ont un caractère nécessaire et sont signalées par un astérisque (*). 
            Dans l&apos;hypothèse où vous refuseriez de communiquer lesdites données, votre demande ne pourra pas être traitée.
          </p>
          <p className="text-gray-700">
            <strong>Important :</strong> Étant donné que Taste Federation est un site de démonstration, vous êtes expressément 
            invité à ne pas utiliser vos vraies données personnelles lors de la réservation. Utilisez uniquement des données fictives.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 3 – Finalités et bases légales du traitement</h2>
          <p className="text-gray-700 mb-4">
            Les données personnelles collectées sont traitées pour les finalités suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Gestion des réservations :</strong> traitement et confirmation des réservations de tables 
              (base légale : exécution du contrat)
            </li>
            <li>
              <strong>Amélioration du service :</strong> analyse statistique de l&apos;utilisation du Site, 
              optimisation des performances (base légale : intérêt légitime)
            </li>
            <li>
              <strong>Respect des obligations légales :</strong> conservation des données pour répondre aux obligations 
              légales et réglementaires (base légale : obligation légale)
            </li>
            <li>
              <strong>Gestion des cookies :</strong> analyse de la navigation, personnalisation de l&apos;expérience 
              utilisateur (base légale : consentement)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 4 – Destinataires et sous-traitants</h2>
          <p className="text-gray-700 mb-4">
            Vos données personnelles sont destinées aux personnes suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>L&apos;équipe de développement du projet Taste Federation</strong> : pour la gestion et la maintenance 
              du Site
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            <strong>Sous-traitants :</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Vercel Inc.</strong> : hébergement du Site (transfert de données hors UE - États-Unis). 
              Vercel est certifié conforme au Privacy Shield et applique des garanties appropriées pour la protection 
              des données personnelles.
            </li>
          </ul>
          <p className="text-gray-700">
            Nous nous assurons que tous nos sous-traitants respectent la réglementation applicable en matière de protection 
            des données personnelles et mettent en œuvre des garanties appropriées.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 5 – Durées de conservation de vos données personnelles</h2>
          <p className="text-gray-700 mb-4">
            Nous ne conservons vos données personnelles que pendant le temps nécessaire aux opérations pour lesquelles 
            elles ont été collectées et dans le respect de la réglementation en vigueur.
          </p>
          <p className="text-gray-700 mb-4">
            De manière générale, en fonction de votre situation, les durées de conservation suivantes pourront s&apos;appliquer :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Données relatives à l&apos;utilisation de cookies :</strong> Au maximum 25 mois, conformément 
              aux durées de conservation des cookies définies dans notre politique cookies.
            </li>
            <li>
              <strong>Données de réservation :</strong> Conservées pendant une durée maximale de 3 ans après la date de la réservation, 
              sauf suppression de votre part.
            </li>
            <li>
              <strong>Données de navigation et statistiques :</strong> Conservées pour une durée maximale de 13 mois 
              à compter de leur collecte.
            </li>
          </ul>
          <p className="text-gray-700">
            Certaines données pourront être conservées pour une durée supplémentaire pour la gestion de réclamations 
            et/ou contentieux ainsi que pour répondre à nos obligations légales ou réglementaires ou encore pour répondre 
            à des demandes d&apos;autorités habilitées. Ces données seront conservées en archivage intermédiaire et 
            bénéficieront d&apos;un accès restreint à ces seules finalités.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 6 – Vos droits</h2>
          <p className="text-gray-700 mb-4">
            Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez 
            des droits suivants concernant vos données personnelles :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Droit d&apos;accès :</strong> Vous avez le droit d&apos;obtenir la confirmation que des données 
                personnelles vous concernant sont ou ne sont pas traitées et, lorsqu&apos;elles le sont, d&apos;obtenir 
                l&apos;accès auxdites données ainsi que certaines informations relatives au traitement.</li>
            <li><strong>Droit de rectification :</strong> Vous avez le droit d&apos;obtenir la rectification des données 
                personnelles inexactes vous concernant. Vous avez également le droit de compléter des données personnelles 
                incomplètes.</li>
            <li><strong>Droit à l&apos;effacement :</strong> Vous avez le droit d&apos;obtenir l&apos;effacement de vos données 
                personnelles dans certains cas prévus par la réglementation.</li>
            <li><strong>Droit à la limitation du traitement :</strong> Vous avez le droit d&apos;obtenir la limitation 
                du traitement de vos données personnelles dans certains cas.</li>
            <li><strong>Droit à la portabilité :</strong> Vous avez le droit de recevoir les données personnelles vous 
                concernant que vous nous avez fournies, dans un format structuré, couramment utilisé et lisible par machine, 
                et vous avez le droit de transmettre ces données à un autre responsable du traitement.</li>
            <li><strong>Droit d&apos;opposition :</strong> Vous avez le droit de vous opposer, pour des raisons tenant à 
                votre situation particulière, au traitement de vos données personnelles fondé sur l&apos;intérêt légitime.</li>
            <li><strong>Droit de retirer votre consentement :</strong> Lorsque le traitement est fondé sur votre consentement, 
                vous avez le droit de le retirer à tout moment, sans que cela n&apos;affecte la licéité du traitement 
                effectué avant le retrait.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Pour exercer vos droits, vous pouvez nous contacter à l&apos;adresse email suivante : 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>. 
            Nous nous engageons à répondre à votre demande dans un délai d&apos;un mois à compter de la réception de votre demande.
          </p>
          <p className="text-gray-700">
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la Commission Nationale de 
            l&apos;Informatique et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles 
            constitue une violation de la réglementation applicable. Pour plus d&apos;informations, vous pouvez consulter 
            le site de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#458236] hover:underline">www.cnil.fr</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 7 – Sécurité</h2>
          <p className="text-gray-700 mb-4">
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir un niveau 
            de sécurité adapté au risque afin de protéger vos données personnelles contre la perte, l&apos;altération, 
            la divulgation ou l&apos;accès non autorisé.
          </p>
          <p className="text-gray-700 mb-4">
            À ce titre, les précautions administratives, organisationnelles, techniques et physiques mises en œuvre ont 
            pour but de protéger vos données à caractère personnel de la perte, du vol, d&apos;un accès non autorisé, 
            d&apos;une transmission non autorisée, de toute modification ou destruction illégitime.
          </p>
          <p className="text-gray-700 mb-4">
            Les mesures et précautions mises en œuvre sont évaluées au regard de la nature des données personnelles traitées 
            et des opérations de traitement entreprises.
          </p>
          <p className="text-gray-700">
            L&apos;ensemble des communications entre votre navigateur et le Site sont sécurisées en HTTPS par l&apos;application 
            de certificats TLS (dernières versions).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 8 – Cookies</h2>
          <p className="text-gray-700 mb-4">
            <strong>Qu&apos;est-ce qu&apos;un cookie ?</strong> Un cookie est un petit fichier texte enregistré depuis 
            un espace dédié du disque dur de votre terminal (ordinateur, tablette, smartphone, etc.), à l&apos;occasion 
            de la consultation d&apos;un service en ligne grâce à votre navigateur. Il permet à son éditeur d&apos;identifier 
            le terminal dans lequel il est enregistré, pendant la durée de validité ou d&apos;enregistrement du cookie.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Comment peuvent-être utilisés les cookies sur le Site ?</strong> Le Site utilise des cookies ou 
            technologies similaires pour améliorer votre expérience utilisateur et analyser le trafic du site.
          </p>
          <p className="text-gray-700 mb-4">
            Certains de ces cookies sont nécessaires pour assurer le bon fonctionnement technique du Site. Ces cookies 
            sont déposés automatiquement dès votre arrivée sur le Site et ne requièrent pas votre consentement.
          </p>
          <p className="text-gray-700">
            Vous pouvez configurer votre navigateur Internet pour qu&apos;il bloque les cookies utilisés sur 
            le Site ou vous alerte à leur sujet, mais certaines parties du Site risqueraient alors de ne pas fonctionner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 9 – Modifications apportées à la présente Politique</h2>
          <p className="text-gray-700 mb-4">
            Nous sommes susceptibles de modifier périodiquement cette Politique. En cas de modifications majeures apportées 
            à la présente Politique, nous afficherons une notification de manière visible sur la page d&apos;accueil du Site. 
            Nous vous invitons à consulter cette Politique régulièrement.
          </p>
          <p className="text-gray-700">
            La date de dernière mise à jour de la présente Politique est indiquée en haut de ce document.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Article 10 – Contact</h2>
          <p className="text-gray-700 mb-4">
            Pour toute question relative à la présente Politique de Protection des Données ou pour exercer vos droits, 
            vous pouvez nous contacter à l&apos;adresse email suivante :
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Email :</strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a>
          </p>
          <p className="text-gray-700">
            <strong>Important :</strong> Taste Federation étant un site de démonstration à des fins éducatives, certaines fonctionnalités 
            peuvent être limitées. Nous nous engageons à répondre à vos demandes dans les meilleurs délais.
          </p>
        </section>

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Cette politique de protection des données est fournie à titre informatif pour le site de démonstration Taste Federation. 
            Pour toute question concernant cette politique ou l&apos;exercice de vos droits, veuillez nous contacter à l&apos;adresse 
            <strong> <a href="mailto:contact@amaury-franssen-dev.com" className="text-[#458236] hover:underline">contact@amaury-franssen-dev.com</a></strong>.
          </p>
        </footer>
      </div>
    </main>
  );
}

