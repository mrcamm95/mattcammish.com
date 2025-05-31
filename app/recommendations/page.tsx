import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Recommendations - Matt Cammish",
  description: "Books, podcasts and other resources that have had a profound impact",
}

export default function RecommendationsPage() {
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
        <h1>Recommendations</h1>

        <p>
          This is a list of books, podcasts and other resources I've found particularly useful. In some instances
          they've had a profound impact on how I think about the world.
        </p>

        <h3>
          <strong>Philosophy</strong>
        </h3>
        <p>
          📚{" "}
          <a href="https://www.amazon.co.uk/Alan-Watts/e/B000AP9KWO" target="_blank" rel="noopener noreferrer">
            Alan Watts
          </a>
          <br />📚{" "}
          <a href="https://www.amazon.co.uk/gp/product/B00R6BGMJO" target="_blank" rel="noopener noreferrer">
            Modern Man In Search of A Soul
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Power-Myth-Joseph-Campbell-ebook/dp/B004QZACH6"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Power of Myth
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Finite-Infinite-Games-James-Carse-ebook/dp/B006W45M38"
            target="_blank"
            rel="noopener noreferrer"
          >
            Finite & Infinite Games
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/What-Matters-Most-Living-Considered/dp/1592404995"
            target="_blank"
            rel="noopener noreferrer"
          >
            What Matters Most
          </a>
        </p>

        <h3>
          <strong>Growth / Marketing</strong>
        </h3>
        <p>
          📚{" "}
          <a
            href="https://www.amazon.co.uk/Eat-Your-Greens-Weimer-Snijders-ebook/dp/B07HP9WYVF"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eat Your Greens
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Long-Short-Balancing-Long-Term-Strategies/dp/085294134X"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Long & The Short Of It
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Alchemy-Surprising-Power-Ideas-Sense-ebook/dp/B01F1HOAWA"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alchemy
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Choice-Factory-behavioural-biases-influence/dp/085719609X"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Choice Factory
          </a>
        </p>

        <h3>
          <strong>Leadership</strong>
        </h3>
        <p>
          📚{" "}
          <a
            href="https://www.amazon.co.uk/Turn-Ship-Around-Building-Breaking-ebook/dp/B015QQ10HE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Turn This Ship Around
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Score-Takes-Care-Itself-Philosophy-ebook/dp/B002G54Y04"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Score Takes Care of Itself
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/What-You-Do-Who-Are-ebook/dp/B07Q4S712S"
            target="_blank"
            rel="noopener noreferrer"
          >
            What You Do Is Who You Are
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Scaling-People-Tactics-Management-Building-ebook/dp/B0BRYQJ49K"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scaling People
          </a>
        </p>

        <h3>
          <strong>Design</strong>
        </h3>
        <p>
          📚{" "}
          <a
            href="https://www.amazon.co.uk/Design-Everyday-Things-Revised-Expanded/dp/B07L5VFQ7K"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Design of Everyday Things
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Elements-User-Experience-User-Centered-Design/dp/0321683684"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Elements of User Experience
          </a>
          <br />📚{" "}
          <a href="https://www.amazon.co.uk/gp/product/0195024028" target="_blank" rel="noopener noreferrer">
            A Timeless Way of Building
          </a>
        </p>

        <h3>
          <strong>Strategy</strong>
        </h3>
        <p>
          📚{" "}
          <a
            href="https://www.amazon.co.uk/Business-Adventures-Classic-bestseller-business-ebook/dp/B00LX6G752"
            target="_blank"
            rel="noopener noreferrer"
          >
            Business Adventures
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/7-Powers-Foundations-Business-Strategy/dp/0998116319"
            target="_blank"
            rel="noopener noreferrer"
          >
            7 Powers
          </a>
          <br />📚{" "}
          <a
            href="https://www.amazon.co.uk/Good-Strategy-Bad-difference-matters/dp/1781256179"
            target="_blank"
            rel="noopener noreferrer"
          >
            Good Strategy, Bad Strategy
          </a>
        </p>

        <h3>
          <strong>Podcasts</strong>
        </h3>
        <p>
          🎙️{" "}
          <a href="https://conversationswithtyler.com/" target="_blank" rel="noopener noreferrer">
            Conversations With Tyler
          </a>
          <br />
          🎙️{" "}
          <a href="https://samharris.org/podcast/" target="_blank" rel="noopener noreferrer">
            Making Sense
          </a>
          <br />
          🎙️{" "}
          <a href="https://marginalrevolution.com/" target="_blank" rel="noopener noreferrer">
            Marginal Revolution
          </a>
          <br />
          🎙️{" "}
          <a href="https://www.econtalk.org/" target="_blank" rel="noopener noreferrer">
            Econ Talk
          </a>
        </p>

        <h3>
          <strong>Blogs & People</strong>
        </h3>
        <p>
          🌐{" "}
          <a href="https://www.strangeloopcanon.com/" target="_blank" rel="noopener noreferrer">
            Strange Loop Canon
          </a>
          <br />🌐{" "}
          <a href="https://www.oneusefulthing.org/" target="_blank" rel="noopener noreferrer">
            One Useful Thing
          </a>
          <br />
          ✒️{" "}
          <a href="https://blog.samaltman.com/" target="_blank" rel="noopener noreferrer">
            Sam Altman
          </a>
          <br />
          ✒️{" "}
          <a href="https://moretothat.com/" target="_blank" rel="noopener noreferrer">
            More To That
          </a>
          <br />
          ✒️{" "}
          <a href="https://www.perell.com/" target="_blank" rel="noopener noreferrer">
            David Perell
          </a>
        </p>
      </article>
    </div>
  )
}
