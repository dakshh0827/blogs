import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer: React.FC = () => {
  const links = [
    { name: 'Homepage', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const tags = [
    { name: 'Travel', href: '/blog?cate=travel'},
    { name: 'Life', href: '/blog?cate=life' },
    { name: 'Fashion', href: '/blog?cate=fashion' },
    { name: 'Food', href: '/blog?cate=food' }
  ]

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/profile.php?id=61576770253950', 
      iconUrl: '/social/facebook.png'
    },
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/_dakshh04/?__pwa=1', 
      iconUrl: '/social/instagram.png'
    },
    { 
      name: 'Youtube', 
      href: 'https://www.youtube.com/@myera7047', 
      iconUrl: '/social/youtube.jpg'
    },
    { 
      name: 'Twitter', 
      href: 'https://x.com/_dakshh04', 
      iconUrl: '/social/twitter.png'
    }
  ]

  return (
    <footer className="mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left Section - Profile and Description */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Profile Image and Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <Image
                  src="/featured.jpg"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground">blogs</h3>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              Heyy you all! This is dakshh, a wannabe developer trying to understand the world of codes. I would not say this was my dream but I enjoy coding. I hope I&apos;ll make some good out of it. Thank you for visiting by, hope you liked it.
            </p>
          </div>

          {/* Right Section - Links, Tags, Social */}
          <div className="flex gap-23 mt-0 md:mt-3">
            {/* Links Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Links</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Tags</h4>
              <ul className="space-y-2">
                {tags.map((tag) => (
                  <li key={tag.name}>
                    <Link
                      href={tag.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Social</h4>
              <ul className="space-y-2">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <Link
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {social.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Social Icons and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-0 pt-6">
          {/* Social Links Icons */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="hover:opacity-80"
                aria-label={social.name}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                  <Image
                    src={social.iconUrl}
                    alt={social.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm order-1 md:order-2 mb-4 md:mb-0">
            © 2025 blogs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
