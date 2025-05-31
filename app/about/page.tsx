import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "About - Matt Cammish",
  description: "Learn more about Matt Cammish and this site",
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>About this site</h1>

        <p>I mostly try to become a little wiser every day.</p>

        <p>
          By day I'm a product manager with expertise in growth and marketing. And by night, I'd class myself as an
          intellectual meathead — you'll usually find me reading books, hitting the gym or training jiu-jitsu.
        </p>

        <p>
          This site hosts my thoughts, ideas and writing on a range of topics — from marketing, growth, philosophy,
          personal development, psychology, finance to business and society. Plus, anything else worth sharing.
        </p>

        <p>
          I've also curated a list of{" "}
          <Link href="/recommendations">
            <strong>recommendations</strong>
          </Link>{" "}
          — some have had a profound impact on my life.
        </p>

        <p>And I'd be delighted if you got in touch. I'm always open to a coffee or phone call.</p>

        <p>
          Email me anytime at{" "}
          <a href="mailto:matt@mattcammish.com">
            <strong>matt@mattcammish.com</strong>
          </a>
          . I always love fascinating conversations with people exploring their interests.
        </p>

        <h2>Latest Essays</h2>
        <ul>
          <li>
            <Link href="/blog/marketing-or-anything-really-as-problem-solving">
              <strong>Marketing (Or Anything, Really) As Problem Solving</strong>
            </Link>
          </li>
          <li>
            <Link href="/blog/design-principles-for-product-managers">
              <strong>31 principles for product managers to know about design</strong>
            </Link>
          </li>
        </ul>

        <h2>What I'm Doing Now</h2>

        <h4>📚 Reading</h4>
        <ul>
          <li>
            <strong>
              <a
                href="https://www.amazon.co.uk/State-Africa-History-Continent-Independence/dp/1471196410"
                target="_blank"
                rel="noopener noreferrer"
              >
                The State of Africa
              </a>
            </strong>
          </li>
          <li>
            <strong>
              <a
                href="https://www.amazon.co.uk/City-History-Origins-Transformations-Prospects/dp/0140207473"
                target="_blank"
                rel="noopener noreferrer"
              >
                The City In History
              </a>
            </strong>
          </li>
          <li>
            <strong>
              <a
                href="https://www.amazon.co.uk/Box-Shipping-Container-Smaller-Economy/dp/0691170819"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Box: How the Shipping Container Made the World Smaller and the World Economy Bigger
              </a>
            </strong>
          </li>
        </ul>

        <h4>💡 Learning</h4>
        <p>
          <em>What does better housing policy look like?</em>
        </p>
        <ul>
          <li>
            <strong>
              <a href="https://www.pricedout.org.uk/" target="_blank" rel="noopener noreferrer">
                Priced Out UK
              </a>
            </strong>
          </li>
          <li>
            <a href="https://www.centreforcities.org/" target="_blank" rel="noopener noreferrer">
              <strong>Centre For Cities</strong>
            </a>
          </li>
          <li>
            <strong>
              <a href="https://www.createstreets.com/" target="_blank" rel="noopener noreferrer">
                Create Streets
              </a>
            </strong>
          </li>
          <li>
            <strong>
              <a
                href="https://www.amazon.co.uk/Order-without-Design-Markets-Cities-ebook/dp/B08BSYX83S"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order without Design
              </a>
            </strong>
          </li>
        </ul>

        <h4>🤼‍♂️ Doing</h4>
        <ul>
          <li>
            Adding wrestling to the mix of my{" "}
            <strong>
              <a href="https://londongrapple.co.uk/" target="_blank" rel="noopener noreferrer">
                grappling skills
              </a>
            </strong>
          </li>
        </ul>
      </article>
    </div>
  )
}
