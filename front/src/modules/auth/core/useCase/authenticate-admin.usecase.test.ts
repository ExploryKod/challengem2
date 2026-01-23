import { authenticateAdminUseCase } from "./authenticate-admin.usecase";

describe("Authenticate admin", () => {
  it("Should open session and keep admin path", async () => {
    const adminAuthGateway = {
      authenticate: jest.fn().mockResolvedValue(true),
    };
    const adminSessionGateway = {
      openSession: jest.fn().mockResolvedValue(undefined),
      closeSession: jest.fn().mockResolvedValue(undefined),
    };

    const result = await authenticateAdminUseCase(
      {
        email: "demo@admin.local",
        password: "password",
        nextPath: "/admin/manage-restaurants",
      },
      {
        adminAuthGateway,
        adminSessionGateway,
      }
    );

    expect(adminAuthGateway.authenticate).toHaveBeenCalledWith(
      "demo@admin.local",
      "password"
    );
    expect(adminSessionGateway.openSession).toHaveBeenCalled();
    expect(result).toEqual({
      isAuthenticated: true,
      nextPath: "/admin/manage-restaurants",
    });
  });

  it("Should reject and fallback to /admin", async () => {
    const adminAuthGateway = {
      authenticate: jest.fn().mockResolvedValue(false),
    };
    const adminSessionGateway = {
      openSession: jest.fn().mockResolvedValue(undefined),
      closeSession: jest.fn().mockResolvedValue(undefined),
    };

    const result = await authenticateAdminUseCase(
      {
        email: "demo@admin.local",
        password: "wrong-password",
        nextPath: "/order",
      },
      {
        adminAuthGateway,
        adminSessionGateway,
      }
    );

    expect(adminSessionGateway.openSession).not.toHaveBeenCalled();
    expect(result).toEqual({
      isAuthenticated: false,
      nextPath: "/admin",
    });
  });
});
