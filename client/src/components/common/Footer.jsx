import { Link } from "react-router-dom"
import styled from "styled-components"
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaUniversity } from "react-icons/fa"

const FooterContainer = styled.footer`
  background-color: #ffffff;
  color: #333;
  padding: 2rem 0;
  border-top: 1px solid #eee;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1e88e5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FooterLink = styled(Link)`
  color: #555;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    color: #1e88e5;
  }
`

const ExternalLink = styled.a`
  color: #555;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    color: #1e88e5;
  }
`

const FooterText = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #eee;
  margin-top: 2rem;
  color: #999;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const SocialLink = styled.a`
  color: #555;
  font-size: 1.2rem;
  transition: 0.3s;

  &:hover {
    color: #1e88e5;
  }
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>CitizenConnect</FooterTitle>
          <FooterText>
            Empowering citizens to engage with government services and provide feedback for better governance.
          </FooterText>
          <SocialLinks>
            <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Register</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle><FaUniversity /> Government Links</FooterTitle>
          <ExternalLink href="https://www.moh.gov.rw" target="_blank">Ministry of Health</ExternalLink>
          <ExternalLink href="https://www.mineduc.gov.rw" target="_blank">Ministry of Education</ExternalLink>
          <ExternalLink href="https://www.mininfra.gov.rw" target="_blank">Ministry of Transport</ExternalLink>
          <ExternalLink href="https://www.minecofin.gov.rw" target="_blank">Ministry of Housing</ExternalLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contact Us</FooterTitle>
          <FooterText><FaMapMarkerAlt /> KN 3 Ave, Kigali, Rwanda</FooterText>
          <FooterText><FaEnvelope /> info@citizenconnect.gov.rw</FooterText>
          <FooterText><FaPhoneAlt /> +250 788 123 456</FooterText>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>© {new Date().getFullYear()} CitizenConnect. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  )
}

export default Footer
