import { useNavigate } from '@tanstack/react-router'; 
import { useAuth } from '@/lib/auth'; 

function PortalAccessIndex() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const customers = [
    {
      name: 'Idighs Anthony',
      email: 'idighs.anthony@gmail.com',
      slug: 'demo-idighs-active',
    },
    {
      name: 'Jamie Chukwuma',
      email: 'jamie.chukwuma99@gmail.com',
      slug: 'demo-jamie-paused',
    },
    {
      name: 'Amadi Florence',
      email: 'amadi.florence.f@gmail.com',
      slug: 'demo-amadi-cards',
    }
  ];

  return (
    <div className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-none py-3 px-4">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-lg font-semibold">Demo Accounts</h2>
        <p className="text-gray-600">Enter PIN 123456 to access</p>
        {customers.map((customer, index) => (
          <div key={index} className="mt-2" onClick={() => {
            navigate({ to: `/portal/access/$${customer.slug}`, search: { pin: '123456' } })
          })}
          >
            <div className="flex items-center gap-3">
              <span className="fw-bold text-sm">{customer.name}</span>
              <span className="text-sm text-gray-600">{customer.email}</span>
              <span className="text-sm text-gray-600 fs-14">
                {customer.status === 'active' ? 'ACTIVE' : customer.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))
      </div>
    </div>
  );
}


// Add this route to your portal layout page (src/routes/portal.tsx)
<br />
// <Route path="/portal/access" component={PortalAccessIndex} />